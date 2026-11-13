using Microsoft.EntityFrameworkCore;
using Muzio.Application.DTOs;
using Muzio.Application.Interfaces;
using Muzio.Domain.Entities;
using Muzio.Infrastructure.Data;

namespace Muzio.Infrastructure.Services;

public class LibraryService : ILibraryService
{
    private readonly MuzioDbContext _db;

    public LibraryService(MuzioDbContext db)
    {
        _db = db;
    }

    public async Task<List<TrackDto>> GetLikedTracksAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.LikedTracks
            .Where(lt => lt.UserId == userId)
            .OrderByDescending(lt => lt.CreatedAt)
            .Select(lt => new TrackDto(
                lt.Track!.Id,
                lt.Track.Title,
                lt.Track.ArtistName,
                lt.Track.ArtistId,
                lt.Track.Album,
                lt.Track.AlbumId,
                lt.Track.Genre,
                lt.Track.ArtworkUrl,
                lt.Track.SourceUrl,
                lt.Track.AudioStreamUrl,
                lt.Track.Provider,
                lt.Track.DurationSeconds,
                lt.Track.IsPlayable,
                lt.Track.PlaybackType,
                lt.Track.DownloadType,
                lt.Track.LicenseInformation,
                lt.Track.LikeCount,
                lt.Track.MoodSlug
            ))
            .ToListAsync(ct);
    }

    public async Task<bool> ToggleLikeTrackAsync(Guid userId, Guid trackId, CancellationToken ct = default)
    {
        var existing = await _db.LikedTracks.FirstOrDefaultAsync(lt => lt.UserId == userId && lt.TrackId == trackId, ct);
        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == trackId, ct);

        if (existing != null)
        {
            _db.LikedTracks.Remove(existing);
            if (track != null && track.LikeCount > 0) track.LikeCount--;
            await _db.SaveChangesAsync(ct);
            return false;
        }

        _db.LikedTracks.Add(new LikedTrack
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TrackId = trackId,
            CreatedAt = DateTime.UtcNow
        });

        if (track != null) track.LikeCount++;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<TrackDto>> GetRecentlyPlayedAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.ListeningHistories
            .Where(lh => lh.UserId == userId)
            .OrderByDescending(lh => lh.PlayedAt)
            .Take(20)
            .Select(lh => new TrackDto(
                lh.Track!.Id,
                lh.Track.Title,
                lh.Track.ArtistName,
                lh.Track.ArtistId,
                lh.Track.Album,
                lh.Track.AlbumId,
                lh.Track.Genre,
                lh.Track.ArtworkUrl,
                lh.Track.SourceUrl,
                lh.Track.AudioStreamUrl,
                lh.Track.Provider,
                lh.Track.DurationSeconds,
                lh.Track.IsPlayable,
                lh.Track.PlaybackType,
                lh.Track.DownloadType,
                lh.Track.LicenseInformation,
                lh.Track.LikeCount,
                lh.Track.MoodSlug
            ))
            .ToListAsync(ct);
    }

    public async Task RecordPlayAsync(Guid userId, Guid trackId, int durationSeconds, CancellationToken ct = default)
    {
        _db.ListeningHistories.Add(new ListeningHistory
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TrackId = trackId,
            PlayedDurationSeconds = durationSeconds,
            PlayedAt = DateTime.UtcNow
        });

        var track = await _db.Tracks.FirstOrDefaultAsync(t => t.Id == trackId, ct);
        if (track != null) track.PlayCount++;

        await _db.SaveChangesAsync(ct);
    }
}

