using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Muzio.Application.DTOs;
using Muzio.Application.Interfaces;
using Muzio.Application.Music;
using Muzio.Infrastructure.Data;
using Muzio.Infrastructure.Music;
using Muzio.Infrastructure.Providers;
using Muzio.Infrastructure.Services;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Muzio.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddHttpClient<IAudiusMusicProvider, AudiusMusicProvider>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(12);
});

var allowedOrigins = builder.Configuration.GetSection("Frontend:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000"];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var usePostgres = builder.Configuration.GetValue<bool>("UsePostgres");

builder.Services.AddDbContext<MuzioDbContext>(options =>
{
    if (usePostgres)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Set ConnectionStrings__DefaultConnection when UsePostgres is enabled.");
        }

        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseInMemoryDatabase("MuzioDb");
    }
});

// Providers & Services
builder.Services.AddScoped<IMusicProvider, AudiusProvider>();
builder.Services.AddHttpClient<IMusicProvider, JamendoProvider>(client =>
{
    client.BaseAddress = new Uri("https://api.jamendo.com/v3.0/");
    client.Timeout = TimeSpan.FromSeconds(12);
});
builder.Services.AddHttpClient<LrclibProvider>();

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IPasswordHasher<ApplicationUser>, PasswordHasher<ApplicationUser>>();
builder.Services.AddScoped<IMusicCatalogService, MusicCatalogService>();
builder.Services.AddScoped<IPlaylistService, PlaylistService>();
builder.Services.AddScoped<ILibraryService, LibraryService>();

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret))
{
    if (!builder.Environment.IsDevelopment())
    {
        throw new InvalidOperationException("Jwt:Secret must be configured outside development.");
    }

    jwtSecret = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
    builder.Configuration["Jwt:Secret"] = jwtSecret;
}

if (Encoding.UTF8.GetByteCount(jwtSecret) < 32)
{
    throw new InvalidOperationException("Jwt:Secret must contain at least 32 bytes.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "Muzio",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "MuzioAudience",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// ----------------------------------------------------
// Health & Info
// ----------------------------------------------------
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "MUZIO Core Engine API",
    tagline = "Music Belongs to Everyone.",
    timestamp = DateTimeOffset.UtcNow
}));

// ----------------------------------------------------
// Authentication Endpoints (/api/v1/auth)
// ----------------------------------------------------
var authGroup = app.MapGroup("/api/v1/auth");

authGroup.MapPost("/register", async (AuthRegisterRequest req, IAuthenticationService auth) =>
{
    try
    {
        var res = await auth.RegisterAsync(req);
        return Results.Created("/api/v1/auth/me", res);
    }
    catch (InvalidOperationException)
    {
        return Results.Conflict(new { error = "An account with those details already exists." });
    }
});

authGroup.MapPost("/login", async (AuthLoginRequest req, IAuthenticationService auth) =>
{
    try
    {
        var res = await auth.LoginAsync(req);
        return Results.Ok(res);
    }
    catch (UnauthorizedAccessException)
    {
        return Results.Unauthorized();
    }
});

authGroup.MapGet("/me", async (ClaimsPrincipal user, IAuthenticationService auth) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(idClaim) || !Guid.TryParse(idClaim, out var userId))
    {
        return Results.Unauthorized();
    }

    var currentUser = await auth.GetCurrentUserAsync(userId);
    return currentUser != null ? Results.Ok(currentUser) : Results.NotFound();
}).RequireAuthorization();

// ----------------------------------------------------
// Music Endpoints (/api/v1/music)
// ----------------------------------------------------
var musicGroup = app.MapGroup("/api/v1/music");

musicGroup.MapGet("/trending", async (int? limit, IMusicCatalogService catalog) =>
{
    var tracks = await catalog.GetTrendingAsync(limit ?? 20);
    return Results.Ok(tracks);
});

musicGroup.MapGet("/search", async (string? q, IMusicCatalogService catalog) =>
{
    if (string.IsNullOrWhiteSpace(q))
    {
        return Results.Ok(new SearchResultDto(new(), new(), new(), new()));
    }
    var results = await catalog.SearchAggregatedAsync(q);
    return Results.Ok(results);
});

musicGroup.MapGet("/moods/{slug}", async (string slug, IMusicCatalogService catalog) =>
{
    var tracks = await catalog.GetByMoodAsync(slug);
    return Results.Ok(tracks);
});

musicGroup.MapGet("/tracks/{id:guid}", async (Guid id, IMusicCatalogService catalog) =>
{
    var track = await catalog.GetTrackByIdAsync(id);
    return track != null ? Results.Ok(track) : Results.NotFound();
});

musicGroup.MapGet("/lyrics/{trackId:guid}", async (Guid trackId, IMusicCatalogService catalog) =>
{
    var lyrics = await catalog.GetLyricsAsync(trackId);
    return lyrics != null ? Results.Ok(lyrics) : Results.NotFound(new { message = "Lyrics currently unavailable" });
});

app.MapGet("/api/tracks", async (IMusicCatalogService catalog, CancellationToken cancellationToken) =>
    Results.Ok(await catalog.GetTrendingAsync(12, cancellationToken)));

app.MapGet("/api/search", async (
    string? q,
    IMusicCatalogService catalog,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(q))
    {
        return Results.Ok(Array.Empty<TrackDto>());
    }

    var results = await catalog.SearchAggregatedAsync(q, cancellationToken);
    return Results.Ok(results.Tracks);
});

// ----------------------------------------------------
// Playlists Endpoints (/api/v1/playlists)
// ----------------------------------------------------
var playlistGroup = app.MapGroup("/api/v1/playlists");

playlistGroup.MapGet("/", async (ClaimsPrincipal user, IPlaylistService playlists, MuzioDbContext db) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (Guid.TryParse(idClaim, out var userId))
    {
        var userPlaylists = await playlists.GetUserPlaylistsAsync(userId);
        return Results.Ok(userPlaylists);
    }

    // Public playlists for guests
    var publicPlaylists = await db.Playlists
        .Where(p => p.IsPublic)
        .Take(12)
        .Select(p => new PlaylistDto(p.Id, p.Title, p.Description, p.CoverArtworkUrl, p.IsPublic, p.Owner != null ? p.Owner.Username : "Muzio", p.OwnerId, p.Tracks.Count, new List<TrackDto>()))
        .ToListAsync();

    return Results.Ok(publicPlaylists);
});

playlistGroup.MapGet("/{id:guid}", async (Guid id, IPlaylistService playlists) =>
{
    var playlist = await playlists.GetPlaylistByIdAsync(id);
    return playlist != null ? Results.Ok(playlist) : Results.NotFound();
});

playlistGroup.MapPost("/", async (CreatePlaylistRequest req, ClaimsPrincipal user, IPlaylistService playlists) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    var result = await playlists.CreatePlaylistAsync(userId, req);
    return Results.Created($"/api/v1/playlists/{result.Id}", result);
}).RequireAuthorization();

playlistGroup.MapPost("/{id:guid}/tracks", async (Guid id, AddTrackToPlaylistRequest req, ClaimsPrincipal user, IPlaylistService playlists) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    var ok = await playlists.AddTrackAsync(id, req.TrackId, userId);
    return ok ? Results.Ok(new { success = true }) : Results.BadRequest();
}).RequireAuthorization();

playlistGroup.MapDelete("/{id:guid}/tracks/{trackId:guid}", async (Guid id, Guid trackId, ClaimsPrincipal user, IPlaylistService playlists) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    var ok = await playlists.RemoveTrackAsync(id, trackId, userId);
    return ok ? Results.Ok(new { success = true }) : Results.BadRequest();
}).RequireAuthorization();

playlistGroup.MapDelete("/{id:guid}", async (Guid id, ClaimsPrincipal user, IPlaylistService playlists) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    var ok = await playlists.DeletePlaylistAsync(id, userId);
    return ok ? Results.Ok(new { success = true }) : Results.BadRequest();
}).RequireAuthorization();

// ----------------------------------------------------
// Library Endpoints (/api/v1/library)
// ----------------------------------------------------
var libraryGroup = app.MapGroup("/api/v1/library").RequireAuthorization();

libraryGroup.MapGet("/liked", async (ClaimsPrincipal user, ILibraryService library) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    var liked = await library.GetLikedTracksAsync(userId);
    return Results.Ok(liked);
});

libraryGroup.MapPost("/liked/{trackId:guid}", async (Guid trackId, ClaimsPrincipal user, ILibraryService library) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    var isLiked = await library.ToggleLikeTrackAsync(userId, trackId);
    return Results.Ok(new { liked = isLiked });
});

libraryGroup.MapGet("/recent", async (ClaimsPrincipal user, ILibraryService library) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    var recent = await library.GetRecentlyPlayedAsync(userId);
    return Results.Ok(recent);
});

libraryGroup.MapPost("/history/{trackId:guid}", async (Guid trackId, int? duration, ClaimsPrincipal user, ILibraryService library) =>
{
    var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!Guid.TryParse(idClaim, out var userId)) return Results.Unauthorized();

    await library.RecordPlayAsync(userId, trackId, duration ?? 180);
    return Results.Ok(new { recorded = true });
});

app.Run();
