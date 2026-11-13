using System.Security.Cryptography;
using System.Text;
using Muzio.Application.DTOs;
using Muzio.Application.Interfaces;
using Muzio.Application.Music;
using Muzio.Domain.Enums;

namespace Muzio.Infrastructure.Providers;

public sealed class AudiusProvider(IAudiusMusicProvider provider) : IMusicProvider
{
    public MusicProviderType ProviderType => MusicProviderType.Audius;
    public string ProviderName => "Audius";

    public async Task<List<TrackDto>> SearchTracksAsync(
        string query,
        int limit = 20,
        CancellationToken ct = default)
    {
        var tracks = await provider.SearchAsync(query, limit, ct);
        return tracks.Select(ToTrackDto).ToList();
    }

    public async Task<List<TrackDto>> GetTrendingTracksAsync(int limit = 20, CancellationToken ct = default)
    {
        var tracks = await provider.GetTrendingAsync(limit, ct);
        return tracks.Select(ToTrackDto).ToList();
    }

    public Task<TrackDto?> GetTrackMetadataAsync(string providerTrackId, CancellationToken ct = default) =>
        Task.FromResult<TrackDto?>(null);

    private static TrackDto ToTrackDto(MusicTrackDto track)
    {
        var idHash = SHA256.HashData(Encoding.UTF8.GetBytes($"{track.Provider}:{track.Id}"));

        return new TrackDto(
            new Guid(idHash.AsSpan(0, 16)),
            track.Title,
            track.ArtistName,
            null,
            track.Album,
            null,
            null,
            track.ArtworkUrl,
            track.ExternalUrl,
            track.AudioStreamUrl,
            track.Provider,
            track.DurationSeconds,
            track.IsPlayable,
            track.IsPlayable ? PlaybackCapability.AuthorizedDirectAudio : PlaybackCapability.MetadataOnly,
            track.CanDownload ? DownloadCapability.DownloadAllowed : DownloadCapability.DownloadRestricted,
            track.LicenseInformation,
            0,
            null);
    }
}
