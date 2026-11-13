using Muzio.Domain.Enums;

namespace Muzio.Domain.Entities;

public class ApplicationUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRoleType Role { get; set; } = UserRoleType.User;
    public bool EmailConfirmed { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    public UserProfile? Profile { get; set; }
    public UserPreference? Preference { get; set; }
    public UserPrivacySetting? PrivacySetting { get; set; }
    public UserStorageUsage? StorageUsage { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
    public ICollection<LikedTrack> LikedTracks { get; set; } = new List<LikedTrack>();
    public ICollection<SavedAlbum> SavedAlbums { get; set; } = new List<SavedAlbum>();
    public ICollection<FollowedArtist> FollowedArtists { get; set; } = new List<FollowedArtist>();
    public ICollection<FollowedUser> Following { get; set; } = new List<FollowedUser>();
    public ICollection<FollowedUser> Followers { get; set; } = new List<FollowedUser>();
    public ICollection<FollowedPlaylist> FollowedPlaylists { get; set; } = new List<FollowedPlaylist>();
    public ICollection<ListeningHistory> ListeningHistories { get; set; } = new List<ListeningHistory>();
    public ICollection<DownloadRecord> DownloadRecords { get; set; } = new List<DownloadRecord>();
    public ICollection<UserUpload> Uploads { get; set; } = new List<UserUpload>();
    public ICollection<UserNotification> Notifications { get; set; } = new List<UserNotification>();
    public ICollection<SearchHistory> SearchHistories { get; set; } = new List<SearchHistory>();
}

public class UserProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string? FavoriteGenresJson { get; set; }
    public string? Location { get; set; }
}

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class UserPreference
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string Theme { get; set; } = "dark-purple"; // approved MUZIO dark purple
    public double DefaultVolume { get; set; } = 0.8;
    public bool ShuffleDefault { get; set; } = false;
    public string RepeatDefault { get; set; } = "off";
    public bool AutoplayEnabled { get; set; } = true;
    public string PreferredAudioQuality { get; set; } = "high";
    public bool CrossfadeEnabled { get; set; } = false;
    public int CrossfadeSeconds { get; set; } = 3;
}

public class UserPrivacySetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public bool IsProfilePublic { get; set; } = true;
    public bool ShareListeningActivity { get; set; } = true;
    public bool ShowPlaylistsOnProfile { get; set; } = true;
    public bool StoreSearchHistory { get; set; } = true;
}

public class UserStorageUsage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public long UploadedBytes { get; set; }
    public long DownloadedBytes { get; set; }
    public long MaxAllowedBytes { get; set; } = 10737418240; // 10 GB
}

