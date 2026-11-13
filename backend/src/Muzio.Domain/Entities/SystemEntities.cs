using Muzio.Domain.Enums;

namespace Muzio.Domain.Entities;

public class DownloadRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid TrackId { get; set; }
    public Track? Track { get; set; }
    public string Status { get; set; } = "Completed"; // Queued, Downloading, Completed, Failed
    public string? FileFormat { get; set; } = "audio/mp3";
    public long FileSizeBytes { get; set; }
    public string? LocalStorageKey { get; set; }
    public DateTime DownloadedAt { get; set; } = DateTime.UtcNow;
}

public class UserUpload
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public string? Album { get; set; }
    public string? Genre { get; set; }
    public int DurationSeconds { get; set; }
    public string FileExtension { get; set; } = ".mp3";
    public string MimeType { get; set; } = "audio/mpeg";
    public long FileSizeBytes { get; set; }
    public string StoragePath { get; set; } = string.Empty;
    public string? CoverArtworkUrl { get; set; }
    public bool IsPrivate { get; set; } = true;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}

public class UserNotification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? ActionUrl { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class SearchHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string Query { get; set; } = string.Empty;
    public DateTime SearchedAt { get; set; } = DateTime.UtcNow;
}

public class ProviderSyncLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ProviderName { get; set; } = string.Empty;
    public string Status { get; set; } = "Success";
    public int ItemsSynchronized { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;
    public long DurationMs { get; set; }
}

public class UserConnectedAccount
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string Provider { get; set; } = string.Empty; // Spotify, ListenBrainz, Google
    public string ExternalUserId { get; set; } = string.Empty;
    public string? ExternalUsername { get; set; }
    public bool IsConnected { get; set; } = true;
    public DateTime ConnectedAt { get; set; } = DateTime.UtcNow;
}

