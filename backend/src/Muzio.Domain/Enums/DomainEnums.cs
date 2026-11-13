namespace Muzio.Domain.Enums;

public enum PlaybackCapability
{
    AuthorizedDirectAudio,
    YouTubeEmbedded,
    AuthorizedExternalPlayback,
    MetadataOnly,
    Unavailable
}

public enum DownloadCapability
{
    DownloadAllowed,
    DownloadRestricted,
    ExternalOnly,
    Unknown
}

public enum MusicProviderType
{
    Audius,
    Jamendo,
    InternetArchive,
    YouTube,
    Spotify,
    MusicBrainz,
    PersonalUpload
}

public enum UserRoleType
{
    User,
    Admin,
    Moderator
}

public enum NotificationType
{
    NewFollower,
    SocialActivity,
    PlaylistActivity,
    SecurityEvent,
    SystemAnnouncement
}

