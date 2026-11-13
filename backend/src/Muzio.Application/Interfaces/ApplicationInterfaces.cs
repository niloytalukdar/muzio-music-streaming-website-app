using Muzio.Application.DTOs;
using Muzio.Domain.Entities;
using Muzio.Domain.Enums;

namespace Muzio.Application.Interfaces;

public interface IMusicProvider
{
    MusicProviderType ProviderType { get; }
    string ProviderName { get; }
    Task<List<TrackDto>> SearchTracksAsync(string query, int limit = 20, CancellationToken ct = default);
    Task<List<TrackDto>> GetTrendingTracksAsync(int limit = 20, CancellationToken ct = default);
    Task<TrackDto?> GetTrackMetadataAsync(string providerTrackId, CancellationToken ct = default);
}

public interface IAuthenticationService
{
    Task<AuthResponse> RegisterAsync(AuthRegisterRequest request, CancellationToken ct = default);
    Task<AuthResponse> LoginAsync(AuthLoginRequest request, CancellationToken ct = default);
    Task<UserDto?> GetCurrentUserAsync(Guid userId, CancellationToken ct = default);
}

public interface IMusicCatalogService
{
    Task<List<TrackDto>> GetTrendingAsync(int limit = 20, CancellationToken ct = default);
    Task<SearchResultDto> SearchAggregatedAsync(string query, CancellationToken ct = default);
    Task<List<TrackDto>> GetByMoodAsync(string moodSlug, CancellationToken ct = default);
    Task<TrackDto?> GetTrackByIdAsync(Guid trackId, CancellationToken ct = default);
    Task<LyricsDto?> GetLyricsAsync(Guid trackId, CancellationToken ct = default);
}

public interface IPlaylistService
{
    Task<List<PlaylistDto>> GetUserPlaylistsAsync(Guid userId, CancellationToken ct = default);
    Task<PlaylistDto?> GetPlaylistByIdAsync(Guid playlistId, CancellationToken ct = default);
    Task<PlaylistDto> CreatePlaylistAsync(Guid userId, CreatePlaylistRequest request, CancellationToken ct = default);
    Task<bool> AddTrackAsync(Guid playlistId, Guid trackId, Guid userId, CancellationToken ct = default);
    Task<bool> RemoveTrackAsync(Guid playlistId, Guid trackId, Guid userId, CancellationToken ct = default);
    Task<bool> DeletePlaylistAsync(Guid playlistId, Guid userId, CancellationToken ct = default);
}

public interface ILibraryService
{
    Task<List<TrackDto>> GetLikedTracksAsync(Guid userId, CancellationToken ct = default);
    Task<bool> ToggleLikeTrackAsync(Guid userId, Guid trackId, CancellationToken ct = default);
    Task<List<TrackDto>> GetRecentlyPlayedAsync(Guid userId, CancellationToken ct = default);
    Task RecordPlayAsync(Guid userId, Guid trackId, int durationSeconds, CancellationToken ct = default);
}

