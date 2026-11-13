using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using Muzio.Application.Music;

namespace Muzio.Infrastructure.Music;

public sealed class AudiusMusicProvider(HttpClient httpClient, IConfiguration configuration) : IAudiusMusicProvider
{
    private readonly string _appName = configuration["Audius:AppName"] ?? "Muzio";

    public Task<IReadOnlyList<MusicTrackDto>> GetTrendingAsync(int limit, CancellationToken cancellationToken) =>
        GetTracksAsync($"tracks/trending?limit={ClampLimit(limit)}", cancellationToken);

    public Task<IReadOnlyList<MusicTrackDto>> SearchAsync(string query, int limit, CancellationToken cancellationToken) =>
        GetTracksAsync($"tracks/search?query={Uri.EscapeDataString(query)}&limit={ClampLimit(limit)}", cancellationToken);

    private async Task<IReadOnlyList<MusicTrackDto>> GetTracksAsync(string endpoint, CancellationToken cancellationToken)
    {
        var response = await httpClient.GetFromJsonAsync<AudiusResponse>(BuildUrl(endpoint), cancellationToken);
        if (response?.Data is null)
        {
            throw new HttpRequestException("Audius returned an invalid track response.");
        }

        return response.Data
            .Where(track => !string.IsNullOrWhiteSpace(track.Id) && !string.IsNullOrWhiteSpace(track.Title))
            .Select(ToDto)
            .ToArray();
    }

    private MusicTrackDto ToDto(AudiusTrack track)
    {
        var playable = track.IsStreamable && track.IsAvailable && !track.IsStreamGated && track.Access?.Stream == true;
        var sourceUrl = playable
            ? BuildUrl($"tracks/{Uri.EscapeDataString(track.Id!)}/stream")
            : null;

        return new MusicTrackDto(
            track.Id!,
            track.Title!.Trim(),
            track.User?.Name ?? track.User?.Handle ?? "Unknown artist",
            null,
            track.Artwork?.Large ?? track.Artwork?.Medium ?? track.Artwork?.Small,
            string.IsNullOrWhiteSpace(track.Permalink) ? null : $"https://audius.co{track.Permalink}",
            sourceUrl,
            "Audius",
            Math.Max(0, track.Duration),
            playable,
            track.IsDownloadable && !track.IsDownloadGated && track.Access?.Download == true,
            track.License);
    }

    private string BuildUrl(string path) =>
        $"https://api.audius.co/v1/{path}{(path.Contains('?') ? '&' : '?')}app_name={Uri.EscapeDataString(_appName)}";

    private static int ClampLimit(int limit) => Math.Clamp(limit, 1, 50);

    private sealed class AudiusResponse
    {
        [JsonPropertyName("data")]
        public List<AudiusTrack>? Data { get; set; }
    }

    private sealed class AudiusTrack
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("permalink")]
        public string? Permalink { get; set; }

        [JsonPropertyName("duration")]
        public int Duration { get; set; }

        [JsonPropertyName("is_streamable")]
        public bool IsStreamable { get; set; }

        [JsonPropertyName("is_available")]
        public bool IsAvailable { get; set; }

        [JsonPropertyName("is_downloadable")]
        public bool IsDownloadable { get; set; }

        [JsonPropertyName("is_stream_gated")]
        public bool IsStreamGated { get; set; }

        [JsonPropertyName("is_download_gated")]
        public bool IsDownloadGated { get; set; }

        [JsonPropertyName("license")]
        public string? License { get; set; }

        [JsonPropertyName("artwork")]
        public AudiusArtwork? Artwork { get; set; }

        [JsonPropertyName("user")]
        public AudiusUser? User { get; set; }

        [JsonPropertyName("access")]
        public AudiusAccess? Access { get; set; }
    }

    private sealed class AudiusArtwork
    {
        [JsonPropertyName("150x150")]
        public string? Small { get; set; }

        [JsonPropertyName("480x480")]
        public string? Medium { get; set; }

        [JsonPropertyName("1000x1000")]
        public string? Large { get; set; }
    }

    private sealed class AudiusUser
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("handle")]
        public string? Handle { get; set; }
    }

    private sealed class AudiusAccess
    {
        [JsonPropertyName("stream")]
        public bool Stream { get; set; }

        [JsonPropertyName("download")]
        public bool Download { get; set; }
    }
}
