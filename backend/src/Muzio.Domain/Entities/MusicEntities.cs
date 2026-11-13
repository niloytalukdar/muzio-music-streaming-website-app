using Muzio.Domain.Enums;

namespace Muzio.Domain.Entities;

public class Track
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string NormalizedTitle { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public Guid? ArtistId { get; set; }
    public Artist? Artist { get; set; }
    public string? Album { get; set; }
    public Guid? AlbumId { get; set; }
    public Album? AlbumEntity { get; set; }
    public string? Genre { get; set; }
    public string? ArtworkUrl { get; set; }
    public string? SourceUrl { get; set; }
    public string? AudioStreamUrl { get; set; }
    public string Provider { get; set; } = "Audius";
    public string? ProviderTrackId { get; set; }
    public int DurationSeconds { get; set; }
    public bool IsPlayable { get; set; } = true;
    public PlaybackCapability PlaybackType { get; set; } = PlaybackCapability.AuthorizedDirectAudio;
    public DownloadCapability DownloadType { get; set; } = DownloadCapability.DownloadAllowed;
    public string? LicenseInformation { get; set; }
    public string? Isrc { get; set; }
    public int PlayCount { get; set; }
    public int LikeCount { get; set; }
    public string? MoodSlug { get; set; } // dreamy, calm, energetic, focus, melancholy, soulful
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PlaylistTrack> PlaylistTracks { get; set; } = new List<PlaylistTrack>();
    public ICollection<LikedTrack> LikedByUsers { get; set; } = new List<LikedTrack>();
    public ICollection<ListeningHistory> ListeningHistories { get; set; } = new List<ListeningHistory>();
}

public class Artist
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? ArtworkUrl { get; set; }
    public string? HeaderImageUrl { get; set; }
    public string? Provider { get; set; }
    public string? ProviderArtistId { get; set; }
    public int FollowerCount { get; set; }
    public int MonthlyListeners { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Track> Tracks { get; set; } = new List<Track>();
    public ICollection<Album> Albums { get; set; } = new List<Album>();
    public ICollection<FollowedArtist> Followers { get; set; } = new List<FollowedArtist>();
}

public class Album
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public Guid ArtistId { get; set; }
    public Artist? Artist { get; set; }
    public string? CoverArtworkUrl { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string? Genre { get; set; }
    public string? Provider { get; set; }
    public string? ProviderAlbumId { get; set; }
    public int TrackCount { get; set; }
    public int TotalDurationSeconds { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Track> Tracks { get; set; } = new List<Track>();
    public ICollection<SavedAlbum> SavedByUsers { get; set; } = new List<SavedAlbum>();
}

public class Genre
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ColorHex { get; set; }
    public string? IconName { get; set; }
}

