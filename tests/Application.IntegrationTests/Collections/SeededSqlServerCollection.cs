namespace Application.IntegrationTests.Collections
{
    [CollectionDefinition("Seeded SQL Server", DisableParallelization = true)]
    public sealed class SeededSqlServerCollection : ICollectionFixture<SeededSqlServerFixture>
    {
    }
}
