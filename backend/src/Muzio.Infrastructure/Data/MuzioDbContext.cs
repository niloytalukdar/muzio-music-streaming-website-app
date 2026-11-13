using Microsoft.EntityFrameworkCore;
using Muzio.Domain.Entities;

namespace Muzio.Infrastructure.Data;

public class MuzioDbContext : DbContext
{
    public MuzioDbContext(DbContextOptions<MuzioDbContext> options) : base(options)
    {
    }

    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();
    public DbSet<UserPrivacySetting> UserPrivacySettings => Set<UserPrivacySetting>();
    public DbSet<UserStorageUsage> UserStorageUsages => Set<UserStorageUsage>();

    public DbSet<Track> Tracks => Set<Track>();
    public DbSet<Artist> Artists => Set<Artist>();
    public DbSet<Album> Albums => Set<Album>();
    public DbSet<Genre> Genres => Set<Genre>();

    public DbSet<Playlist> Playlists => Set<Playlist>();
    public DbSet<PlaylistTrack> PlaylistTracks => Set<PlaylistTrack>();
    public DbSet<LikedTrack> LikedTracks => Set<LikedTrack>();
    public DbSet<SavedAlbum> SavedAlbums => Set<SavedAlbum>();
    public DbSet<FollowedArtist> FollowedArtists => Set<FollowedArtist>();
    public DbSet<FollowedUser> FollowedUsers => Set<FollowedUser>();
    public DbSet<FollowedPlaylist> FollowedPlaylists => Set<FollowedPlaylist>();
    public DbSet<ListeningHistory> ListeningHistories => Set<ListeningHistory>();

    public DbSet<DownloadRecord> DownloadRecords => Set<DownloadRecord>();
    public DbSet<UserUpload> UserUploads => Set<UserUpload>();
    public DbSet<UserNotification> UserNotifications => Set<UserNotification>();
    public DbSet<SearchHistory> SearchHistories => Set<SearchHistory>();
    public DbSet<ProviderSyncLog> ProviderSyncLogs => Set<ProviderSyncLog>();
    public DbSet<UserConnectedAccount> UserConnectedAccounts => Set<UserConnectedAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User indexes & relationships
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.Username).HasMaxLength(50).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(255).IsRequired();
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasOne(p => p.User)
                  .WithOne(u => u.Profile)
                  .HasForeignKey<UserProfile>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserPreference>(entity =>
        {
            entity.HasOne(p => p.User)
                  .WithOne(u => u.Preference)
                  .HasForeignKey<UserPreference>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserPrivacySetting>(entity =>
        {
            entity.HasOne(p => p.User)
                  .WithOne(u => u.PrivacySetting)
                  .HasForeignKey<UserPrivacySetting>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserStorageUsage>(entity =>
        {
            entity.HasOne(p => p.User)
                  .WithOne(u => u.StorageUsage)
                  .HasForeignKey<UserStorageUsage>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Track relationships
        modelBuilder.Entity<Track>(entity =>
        {
            entity.HasIndex(t => t.Title);
            entity.HasIndex(t => t.ArtistName);
            entity.HasIndex(t => t.MoodSlug);
            entity.HasIndex(t => t.Isrc);

            entity.HasOne(t => t.Artist)
                  .WithMany(a => a.Tracks)
                  .HasForeignKey(t => t.ArtistId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(t => t.AlbumEntity)
                  .WithMany(a => a.Tracks)
                  .HasForeignKey(t => t.AlbumId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Playlist relationships
        modelBuilder.Entity<PlaylistTrack>(entity =>
        {
            entity.HasIndex(pt => new { pt.PlaylistId, pt.TrackId }).IsUnique();
            entity.HasIndex(pt => new { pt.PlaylistId, pt.Position });

            entity.HasOne(pt => pt.Playlist)
                  .WithMany(p => p.Tracks)
                  .HasForeignKey(pt => pt.PlaylistId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pt => pt.Track)
                  .WithMany(t => t.PlaylistTracks)
                  .HasForeignKey(pt => pt.TrackId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // LikedTrack unique constraint
        modelBuilder.Entity<LikedTrack>(entity =>
        {
            entity.HasIndex(lt => new { lt.UserId, lt.TrackId }).IsUnique();

            entity.HasOne(lt => lt.User)
                  .WithMany(u => u.LikedTracks)
                  .HasForeignKey(lt => lt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(lt => lt.Track)
                  .WithMany(t => t.LikedByUsers)
                  .HasForeignKey(lt => lt.TrackId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // SavedAlbum unique constraint
        modelBuilder.Entity<SavedAlbum>(entity =>
        {
            entity.HasIndex(sa => new { sa.UserId, sa.AlbumId }).IsUnique();
        });

        // FollowedArtist unique constraint
        modelBuilder.Entity<FollowedArtist>(entity =>
        {
            entity.HasIndex(fa => new { fa.UserId, fa.ArtistId }).IsUnique();
        });

        // FollowedUser unique constraint
        modelBuilder.Entity<FollowedUser>(entity =>
        {
            entity.HasIndex(fu => new { fu.FollowerId, fu.FolloweeId }).IsUnique();

            entity.HasOne(fu => fu.Follower)
                  .WithMany(u => u.Following)
                  .HasForeignKey(fu => fu.FollowerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(fu => fu.Followee)
                  .WithMany(u => u.Followers)
                  .HasForeignKey(fu => fu.FolloweeId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // FollowedPlaylist unique constraint
        modelBuilder.Entity<FollowedPlaylist>(entity =>
        {
            entity.HasIndex(fp => new { fp.UserId, fp.PlaylistId }).IsUnique();
        });
    }
}
