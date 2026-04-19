using System;
using System.Collections.Generic;
using System.Text;

namespace Application.IntegrationTests.Collections
{
    [CollectionDefinition("Seeded SQL Server")]
    public sealed class SeededSqlServerCollection : ICollectionFixture<SeededSqlServerFixture>
    {
    }
}
