using Muzio.Domain.Entities;
using Muzio.Domain.Enums;

namespace Muzio.Application.DTOs;

public record AuthRegisterRequest(string Username, string Email, string Password);
public record AuthLoginRequest(string Email, string Password);
public record AuthResponse(string Token, string RefreshToken, UserDto User);
public record UserDto(Guid Id, string Username, string Email, string Role, UserProfileDto? Profile);
public record UserProfileDto(string DisplayName, string? AvatarUrl, string? Bio, string? Location);

public record TrackDto(
    Guid Id,
    string Title,
    string ArtistName,
    Guid? ArtistId,
    string? Album,
    Guid? AlbumId,
    string? Genre,
    string? ArtworkUrl,
    string? SourceUrl,
    string? AudioStreamUrl,
    string Provider,
    int DurationSeconds,
    bool IsPlayable,
    PlaybackCapability PlaybackType,
    DownloadCapability DownloadType,
    string? LicenseInformation,
    int LikesCount,
    string? MoodSlug
);

public record PlaylistDto(
    Guid Id,
    string Title,
    string? Description,
    string? CoverArtworkUrl,
    bool IsPublic,
    string OwnerUsername,
    Guid OwnerId,
    int TrackCount,
    List<TrackDto> Tracks
);

public record CreatePlaylistRequest(string Title, string? Description, bool IsPublic);
public record AddTrackToPlaylistRequest(Guid TrackId);

public record SearchResultDto(
    List<TrackDto> Tracks,
    List<ArtistSummaryDto> Artists,
    List<AlbumSummaryDto> Albums,
    List<PlaylistDto> Playlists
);

public record ArtistSummaryDto(Guid Id, string Name, string? ArtworkUrl, int FollowerCount);
public record AlbumSummaryDto(Guid Id, string Title, string ArtistName, string? CoverArtworkUrl, int TrackCount);

public record MoodCategoryDto(string Name, string Slug, string Description, string AccentColor, List<TrackDto> TopTracks);
public record LyricsDto(string TrackTitle, string ArtistName, string? PlainLyrics, string? SyncedLyricsJson, bool IsSynced);

