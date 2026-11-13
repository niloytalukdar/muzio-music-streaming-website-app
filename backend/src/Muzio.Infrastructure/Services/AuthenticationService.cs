using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Muzio.Application.DTOs;
using Muzio.Application.Interfaces;
using Muzio.Domain.Entities;
using Muzio.Domain.Enums;
using Muzio.Infrastructure.Data;

namespace Muzio.Infrastructure.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly MuzioDbContext _db;
    private readonly IConfiguration _config;
    private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

    public AuthenticationService(
        MuzioDbContext db,
        IConfiguration config,
        IPasswordHasher<ApplicationUser> passwordHasher)
    {
        _db = db;
        _config = config;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponse> RegisterAsync(AuthRegisterRequest request, CancellationToken ct = default)
    {
        var existing = await _db.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower() || u.Username.ToLower() == request.Username.ToLower(), ct);
        if (existing)
        {
            throw new InvalidOperationException("User with this email or username already exists.");
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Username = request.Username.Trim(),
            Email = request.Email.Trim().ToLower(),
            Role = UserRoleType.User,
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow,
            Profile = new UserProfile
            {
                Id = Guid.NewGuid(),
                DisplayName = request.Username.Trim(),
                AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                Bio = "Music Belongs to Everyone."
            },
            Preference = new UserPreference
            {
                Id = Guid.NewGuid(),
                Theme = "dark-purple"
            },
            PrivacySetting = new UserPrivacySetting
            {
                Id = Guid.NewGuid()
            },
            StorageUsage = new UserStorageUsage
            {
                Id = Guid.NewGuid()
            }
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        var token = GenerateJwt(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        });

        await _db.SaveChangesAsync(ct);

        return new AuthResponse(token, refreshToken, MapUserDto(user));
    }

    public async Task<AuthResponse> LoginAsync(AuthLoginRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower(), ct);

        if (user == null ||
            _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        var token = GenerateJwt(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        });

        await _db.SaveChangesAsync(ct);

        return new AuthResponse(token, refreshToken, MapUserDto(user));
    }

    public async Task<UserDto?> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        return user != null ? MapUserDto(user) : null;
    }

    private string GenerateJwt(ApplicationUser user)
    {
        var secret = _config["Jwt:Secret"];
        if (string.IsNullOrWhiteSpace(secret))
        {
            throw new InvalidOperationException("Jwt:Secret must be configured.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "Muzio",
            audience: _config["Jwt:Audience"] ?? "MuzioAudience",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }

    private static UserDto MapUserDto(ApplicationUser user) => new(
        user.Id,
        user.Username,
        user.Email,
        user.Role.ToString(),
        user.Profile != null ? new UserProfileDto(user.Profile.DisplayName, user.Profile.AvatarUrl, user.Profile.Bio, user.Profile.Location) : null
    );
}

