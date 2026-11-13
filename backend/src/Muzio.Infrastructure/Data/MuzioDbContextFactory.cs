using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Muzio.Infrastructure.Data;

public sealed class MuzioDbContextFactory : IDesignTimeDbContextFactory<MuzioDbContext>
{
    public MuzioDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Set ConnectionStrings__DefaultConnection before creating or applying migrations.");
        }

        var options = new DbContextOptionsBuilder<MuzioDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new MuzioDbContext(options);
    }
}
