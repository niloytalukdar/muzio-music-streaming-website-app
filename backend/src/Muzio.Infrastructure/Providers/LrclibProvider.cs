using System.Text.Json;
using Muzio.Application.DTOs;

namespace Muzio.Infrastructure.Providers;

public class LrclibProvider
{
    private readonly HttpClient _httpClient;

    public LrclibProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress ??= new Uri("https://lrclib.net/api/");
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("MuzioStreamingApp/1.0");
    }

    public async Task<LyricsDto?> GetLyricsAsync(string trackName, string artistName, CancellationToken ct = default)
    {
        try
        {
            var url = $"get?track_name={Uri.EscapeDataString(trackName)}&artist_name={Uri.EscapeDataString(artistName)}";
            var response = await _httpClient.GetAsync(url, ct);
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            var plain = root.TryGetProperty("plainLyrics", out var p) ? p.GetString() : null;
            var synced = root.TryGetProperty("syncedLyrics", out var s) ? s.GetString() : null;

            return new LyricsDto(
                trackName,
                artistName,
                plain,
                synced,
                !string.IsNullOrWhiteSpace(synced)
            );
        }
        catch
        {
            return null;
        }
    }
}

