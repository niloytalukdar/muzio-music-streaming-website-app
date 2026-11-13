using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Muzio.Application.DTOs;
using Muzio.Application.Interfaces;
using Muzio.Domain.Entities;
using Muzio.Domain.Enums;
using Muzio.Infrastructure.Data;
using Muzio.Infrastructure.Providers;

namespace Muzio.Infrastructure.Services;

public class MusicCatalogService : IMusicCatalogService
{
    private readonly MuzioDbContext _db;
    private readonly IEnumerable<IMusicProvider> _providers;
    private readonly LrclibProvider _lrclibProvider;
    private readonly ILogger<MusicCatalogService> _logger;

    public MusicCatalogService(
        MuzioDbContext db,
        IEnumerable<IMusicProvider> providers,
        LrclibProvider lrclibProvider,
        ILogger<MusicCatalogService> logger)
    {
        _db = db;
        _providers = providers;
        _lrclibProvider = lrclibProvider;
        _logger = logger;
    }

    public async Task<List<TrackDto>> GetTrendingAsync(int limit = 20, CancellationToken ct = default)
    {
        var localTracks = await _db.Tracks
            .OrderByDescending(t => t.LikeCount)
            .Take(limit)
            .Select(t => MapToDto(t))
            .ToListAsync(ct);

        if (localTracks.Count >= 6)
        {
            return localTracks;
        }

        var providerCount = 0;
        var providerFailureCount = 0;

        // Augment with provider tracks
        foreach (var provider in _providers)
        {
            providerCount++;
            try
            {
                var providerTrending = await provider.GetTrendingTracksAsync(limit - localTracks.Count, ct);
                localTracks.AddRange(providerTrending);
                if (localTracks.Count >= limit) break;
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex) when (IsProviderFailure(ex))
            {
                providerFailureCount++;
                _logger.LogWarning(ex, "Failed to fetch trending tracks from {Provider}.", provider.ProviderName);
            }
        }

        if (localTracks.Count == 0 && providerCount > 0 && providerFailureCount == providerCount)
        {
            throw new HttpRequestException("All music providers failed to return trending tracks.");
        }

        return localTracks;
    }

    public async Task<SearchResultDto> SearchAggregatedAsync(string query, CancellationToken ct = default)
    {
        var cleanQuery = query.Trim().ToLowerInvariant();

        var dbTracks = await _db.Tracks
            .Where(t => t.Title.ToLower().Contains(cleanQuery) || t.ArtistName.ToLower().Contains(cleanQuery))
            .Take(15)
            .Select(t => MapToDto(t))
            .ToListAsync(ct);

        var dbArtists = await _db.Artists
            .Where(a => a.Name.ToLower().Contains(cleanQuery))
            .Take(6)
            .Select(a => new ArtistSummaryDto(a.Id, a.Name, a.ArtworkUrl, a.FollowerCount))
            .ToListAsync(ct);

        var dbAlbums = await _db.Albums
            .Where(al => al.Title.ToLower().Contains(cleanQuery))
            .Take(6)
            .Select(al => new AlbumSummaryDto(al.Id, al.Title, al.Artist != null ? al.Artist.Name : "Artist", al.CoverArtworkUrl, al.TrackCount))
            .ToListAsync(ct);

        var dbPlaylists = await _db.Playlists
            .Where(p => p.Title.ToLower().Contains(cleanQuery) && p.IsPublic)
            .Take(6)
            .Select(p => new PlaylistDto(p.Id, p.Title, p.Description, p.CoverArtworkUrl, p.IsPublic, p.Owner != null ? p.Owner.Username : "Muzio", p.OwnerId, p.Tracks.Count, new List<TrackDto>()))
            .ToListAsync(ct);

        // Fetch from providers if results are sparse
        if (dbTracks.Count < 10)
        {
            var providerCount = 0;
            var providerFailureCount = 0;

            foreach (var provider in _providers)
            {
                providerCount++;
                try
                {
                    var ext = await provider.SearchTracksAsync(cleanQuery, 10 - dbTracks.Count, ct);
                    dbTracks.AddRange(ext);
                }
                catch (OperationCanceledException) when (ct.IsCancellationRequested)
                {
                    throw;
                }
                catch (Exception ex) when (IsProviderFailure(ex))
                {
                    providerFailureCount++;
                    _logger.LogWarning(ex, "Failed to search {Provider}.", provider.ProviderName);
                }
            }

            if (dbTracks.Count == 0 && dbArtists.Count == 0 && dbAlbums.Count == 0 && dbPlaylists.Count == 0 &&
                providerCount > 0 && providerFailureCount == providerCount)
            {
                throw new HttpRequestException("All music providers failed to complete the search.");
            }
        }

        return new SearchResultDto(dbTracks, dbArtists, dbAlbums, dbPlaylists);
    }

    public async Task<List<TrackDto>> GetByMoodAsync(string moodSlug, CancellationToken ct = default)
    {
        var slug = moodSlug.ToLowerInvariant();
        var tracks = await _db.Tracks
            .Where(t => t.MoodSlug == slug)
            .Take(25)
            .Select(t => MapToDto(t))
            .ToListAsync(ct);

        return tracks;
    }

    public async Task<TrackDto?> GetTrackByIdAsync(Guid trackId, CancellationToken ct = default)
    {
        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == trackId, ct);
        return track != null ? MapToDto(track) : null;
    }

    public async Task<LyricsDto?> GetLyricsAsync(Guid trackId, CancellationToken ct = default)
    {
        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == trackId, ct);
        if (track == null) return null;

        return await _lrclibProvider.GetLyricsAsync(track.Title, track.ArtistName, ct);
    }

    private static TrackDto MapToDto(Track t) => new(
        t.Id,
        t.Title,
        t.ArtistName,
        t.ArtistId,
        t.Album,
        t.AlbumId,
        t.Genre,
        t.ArtworkUrl,
        t.SourceUrl,
        t.AudioStreamUrl,
        t.Provider,
        t.DurationSeconds,
        t.IsPlayable,
        t.PlaybackType,
        t.DownloadType,
        t.LicenseInformation,
        t.LikeCount,
        t.MoodSlug
    );

    private static bool IsProviderFailure(Exception exception) =>
        exception is HttpRequestException or InvalidOperationException or JsonException or TimeoutException or TaskCanceledException;
}

