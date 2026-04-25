using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure
{
    // This factory is used by EF Core tools (like migrations) to create an instance of ShopContext at design time.    
    public class ShopContextFactory : IDesignTimeDbContextFactory<ShopContext>
    {
        public ShopContext CreateDbContext(string[] args)
        {
            var connectionString = Environment.GetEnvironmentVariable("ShopDb_ConnectionString")
                ?? "Data Source=.\\SQLEXPRESS;Initial Catalog=ShopDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False;Command Timeout=30";

            var optionsBuilder = new DbContextOptionsBuilder<ShopContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new ShopContext(optionsBuilder.Options);
        }
    }
}
