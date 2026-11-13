namespace Muzio.Application.Music;

public sealed record MusicTrackDto(
    string Id,
    string Title,
    string ArtistName,
    string? Album,
    string? ArtworkUrl,
    string? ExternalUrl,
    string? AudioStreamUrl,
    string Provider,
    int DurationSeconds,
    bool IsPlayable,
    bool CanDownload,
    string? LicenseInformation);

public interface IAudiusMusicProvider
{
    Task<IReadOnlyList<MusicTrackDto>> GetTrendingAsync(int limit, CancellationToken cancellationToken);
    Task<IReadOnlyList<MusicTrackDto>> SearchAsync(string query, int limit, CancellationToken cancellationToken);
}
