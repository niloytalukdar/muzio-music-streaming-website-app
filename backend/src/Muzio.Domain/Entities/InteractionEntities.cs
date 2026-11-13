namespace Muzio.Domain.Entities;

public class Playlist
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverArtworkUrl { get; set; }
    public bool IsPublic { get; set; } = true;
    public Guid OwnerId { get; set; }
    public ApplicationUser? Owner { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PlaylistTrack> Tracks { get; set; } = new List<PlaylistTrack>();
    public ICollection<FollowedPlaylist> Followers { get; set; } = new List<FollowedPlaylist>();
}

public class PlaylistTrack
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PlaylistId { get; set; }
    public Playlist? Playlist { get; set; }
    public Guid TrackId { get; set; }
    public Track? Track { get; set; }
    public int Position { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}

public class LikedTrack
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid TrackId { get; set; }
    public Track? Track { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class SavedAlbum
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid AlbumId { get; set; }
    public Album? Album { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class FollowedArtist
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid ArtistId { get; set; }
    public Artist? Artist { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class FollowedUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FollowerId { get; set; }
    public ApplicationUser? Follower { get; set; }
    public Guid FolloweeId { get; set; }
    public ApplicationUser? Followee { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class FollowedPlaylist
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid PlaylistId { get; set; }
    public Playlist? Playlist { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ListeningHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid TrackId { get; set; }
    public Track? Track { get; set; }
    public int PlayedDurationSeconds { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
}

