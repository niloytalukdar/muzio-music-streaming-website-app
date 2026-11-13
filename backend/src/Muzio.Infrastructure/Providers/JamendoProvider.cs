using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Muzio.Application.DTOs;
using Muzio.Application.Interfaces;
using Muzio.Domain.Enums;

namespace Muzio.Infrastructure.Providers;

public sealed class JamendoProvider(HttpClient httpClient, IConfiguration configuration) : IMusicProvider
{
    private readonly string? _clientId = configuration["Jamendo:ClientId"];

    public MusicProviderType ProviderType => MusicProviderType.Jamendo;
    public string ProviderName => "Jamendo";

    public Task<List<TrackDto>> SearchTracksAsync(
        string query,
        int limit = 20,
        CancellationToken ct = default) =>
        GetTracksAsync($"tracks/?format=json&limit={ClampLimit(limit)}&namesearch={Uri.EscapeDataString(query)}&include=musicinfo", ct);

    public Task<List<TrackDto>> GetTrendingTracksAsync(int limit = 20, CancellationToken ct = default) =>
        GetTracksAsync($"tracks/?format=json&limit={ClampLimit(limit)}&order=popularity_total&include=musicinfo", ct);

    public Task<TrackDto?> GetTrackMetadataAsync(string providerTrackId, CancellationToken ct = default) =>
        Task.FromResult<TrackDto?>(null);

    private async Task<List<TrackDto>> GetTracksAsync(string endpoint, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(_clientId))
        {
            throw new InvalidOperationException("Jamendo is disabled because Jamendo:ClientId is not configured.");
        }

        using var response = await httpClient.GetAsync(
            $"{endpoint}&client_id={Uri.EscapeDataString(_clientId)}",
            ct);
        response.EnsureSuccessStatusCode();

        await using var content = await response.Content.ReadAsStreamAsync(ct);
        using var document = await JsonDocument.ParseAsync(content, cancellationToken: ct);
        if (!document.RootElement.TryGetProperty("results", out var results) ||
            results.ValueKind != JsonValueKind.Array)
        {
            throw new HttpRequestException("Jamendo returned an invalid track response.");
        }

        var tracks = new List<TrackDto>();
        foreach (var item in results.EnumerateArray())
        {
            if (!TryGetString(item, "id", out var providerTrackId) ||
                !TryGetString(item, "name", out var title) ||
                !TryGetString(item, "artist_name", out var artist))
            {
                continue;
            }

            var audio = GetString(item, "audio");
            var downloadUrl = GetString(item, "audiodownload");
            var isDownloadable = GetBoolean(item, "audiodownload_allowed") && !string.IsNullOrWhiteSpace(downloadUrl);
            var isPlayable = !string.IsNullOrWhiteSpace(audio);
            var idHash = SHA256.HashData(Encoding.UTF8.GetBytes($"Jamendo:{providerTrackId}"));

            tracks.Add(new TrackDto(
                new Guid(idHash.AsSpan(0, 16)),
                title,
                artist,
                null,
                GetString(item, "album_name"),
                null,
                GetString(item, "musicinfo"),
                GetString(item, "image"),
                GetString(item, "shareurl"),
                audio,
                ProviderName,
                GetInt32(item, "duration"),
                isPlayable,
                isPlayable ? PlaybackCapability.AuthorizedDirectAudio : PlaybackCapability.MetadataOnly,
                isDownloadable ? DownloadCapability.DownloadAllowed : DownloadCapability.DownloadRestricted,
                GetString(item, "license_ccurl"),
                0,
                null));
        }

        return tracks;
    }

    private static int ClampLimit(int limit) => Math.Clamp(limit, 1, 50);

    private static bool TryGetString(JsonElement element, string propertyName, out string value)
    {
        value = GetString(element, propertyName) ?? string.Empty;
        return !string.IsNullOrWhiteSpace(value);
    }

    private static string? GetString(JsonElement element, string propertyName) =>
        element.TryGetProperty(propertyName, out var property) && property.ValueKind == JsonValueKind.String
            ? property.GetString()
            : null;

    private static int GetInt32(JsonElement element, string propertyName) =>
        element.TryGetProperty(propertyName, out var property) && property.TryGetInt32(out var value)
            ? Math.Max(0, value)
            : 0;

    private static bool GetBoolean(JsonElement element, string propertyName) =>
        element.TryGetProperty(propertyName, out var property) && property.ValueKind == JsonValueKind.True;
}
