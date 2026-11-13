using Microsoft.EntityFrameworkCore;
using Muzio.Application.DTOs;
using Muzio.Application.Interfaces;
using Muzio.Domain.Entities;
using Muzio.Infrastructure.Data;

namespace Muzio.Infrastructure.Services;

public class PlaylistService : IPlaylistService
{
    private readonly MuzioDbContext _db;

    public PlaylistService(MuzioDbContext db)
    {
        _db = db;
    }

    public async Task<List<PlaylistDto>> GetUserPlaylistsAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.Playlists
            .Where(p => p.OwnerId == userId)
            .OrderByDescending(p => p.UpdatedAt)
            .Select(p => new PlaylistDto(
                p.Id,
                p.Title,
                p.Description,
                p.CoverArtworkUrl,
                p.IsPublic,
                p.Owner != null ? p.Owner.Username : "You",
                p.OwnerId,
                p.Tracks.Count,
                p.Tracks.OrderBy(t => t.Position).Select(pt => new TrackDto(
                    pt.Track!.Id,
                    pt.Track.Title,
                    pt.Track.ArtistName,
                    pt.Track.ArtistId,
                    pt.Track.Album,
                    pt.Track.AlbumId,
                    pt.Track.Genre,
                    pt.Track.ArtworkUrl,
                    pt.Track.SourceUrl,
                    pt.Track.AudioStreamUrl,
                    pt.Track.Provider,
                    pt.Track.DurationSeconds,
                    pt.Track.IsPlayable,
                    pt.Track.PlaybackType,
                    pt.Track.DownloadType,
                    pt.Track.LicenseInformation,
                    pt.Track.LikeCount,
                    pt.Track.MoodSlug
                )).ToList()
            ))
            .ToListAsync(ct);
    }

    public async Task<PlaylistDto?> GetPlaylistByIdAsync(Guid playlistId, CancellationToken ct = default)
    {
        var p = await _db.Playlists
            .Include(x => x.Owner)
            .Include(x => x.Tracks)
                .ThenInclude(pt => pt.Track)
            .FirstOrDefaultAsync(x => x.Id == playlistId, ct);

        if (p == null) return null;

        return new PlaylistDto(
            p.Id,
            p.Title,
            p.Description,
            p.CoverArtworkUrl,
            p.IsPublic,
            p.Owner != null ? p.Owner.Username : "User",
            p.OwnerId,
            p.Tracks.Count,
            p.Tracks.OrderBy(t => t.Position).Where(pt => pt.Track != null).Select(pt => new TrackDto(
                pt.Track!.Id,
                pt.Track.Title,
                pt.Track.ArtistName,
                pt.Track.ArtistId,
                pt.Track.Album,
                pt.Track.AlbumId,
                pt.Track.Genre,
                pt.Track.ArtworkUrl,
                pt.Track.SourceUrl,
                pt.Track.AudioStreamUrl,
                pt.Track.Provider,
                pt.Track.DurationSeconds,
                pt.Track.IsPlayable,
                pt.Track.PlaybackType,
                pt.Track.DownloadType,
                pt.Track.LicenseInformation,
                pt.Track.LikeCount,
                pt.Track.MoodSlug
            )).ToList()
        );
    }

    public async Task<PlaylistDto> CreatePlaylistAsync(Guid userId, CreatePlaylistRequest request, CancellationToken ct = default)
    {
        var playlist = new Playlist
        {
            Id = Guid.NewGuid(),
            Title = string.IsNullOrWhiteSpace(request.Title) ? "My Playlist" : request.Title.Trim(),
            Description = request.Description,
            IsPublic = request.IsPublic,
            OwnerId = userId,
            CoverArtworkUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Playlists.Add(playlist);
        await _db.SaveChangesAsync(ct);

        return new PlaylistDto(
            playlist.Id,
            playlist.Title,
            playlist.Description,
            playlist.CoverArtworkUrl,
            playlist.IsPublic,
            "You",
            userId,
            0,
            new List<TrackDto>()
        );
    }

    public async Task<bool> AddTrackAsync(Guid playlistId, Guid trackId, Guid userId, CancellationToken ct = default)
    {
        var playlist = await _db.Playlists.Include(p => p.Tracks).FirstOrDefaultAsync(p => p.Id == playlistId && p.OwnerId == userId, ct);
        if (playlist == null) return false;

        var exists = playlist.Tracks.Any(t => t.TrackId == trackId);
        if (exists) return true;

        var position = playlist.Tracks.Count;
        _db.PlaylistTracks.Add(new PlaylistTrack
        {
            Id = Guid.NewGuid(),
            PlaylistId = playlistId,
            TrackId = trackId,
            Position = position,
            AddedAt = DateTime.UtcNow
        });

        playlist.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> RemoveTrackAsync(Guid playlistId, Guid trackId, Guid userId, CancellationToken ct = default)
    {
        var playlist = await _db.Playlists.Include(p => p.Tracks).FirstOrDefaultAsync(p => p.Id == playlistId && p.OwnerId == userId, ct);
        if (playlist == null) return false;

        var entry = playlist.Tracks.FirstOrDefault(t => t.TrackId == trackId);
        if (entry == null) return false;

        _db.PlaylistTracks.Remove(entry);
        playlist.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeletePlaylistAsync(Guid playlistId, Guid userId, CancellationToken ct = default)
    {
        var playlist = await _db.Playlists.FirstOrDefaultAsync(p => p.Id == playlistId && p.OwnerId == userId, ct);
        if (playlist == null) return false;

        _db.Playlists.Remove(playlist);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}

