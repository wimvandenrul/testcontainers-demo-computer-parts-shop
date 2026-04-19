import { test as setup } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { GenericContainer, Network, Wait } from "testcontainers";

// Disable Ryuk auto-cleanup so containers survive beyond test process exit
//process.env.TESTCONTAINERS_RYUK_DISABLED = "true";

let dbContainer: any;
let apiContainer: any;

setup('create testcontainers', async ({ }) => {
  // 1. Start SQL Server container
  // TODO: Use MSSQLServerContainer from testcontainers instead of GenericContainer for better configuration and management
  // await using dbContainer = 
  //   await new MSSQLServerContainer("mcr.microsoft.com/mssql/server:2025-latest")
  //   .acceptLicense()
  //   .start();

  const network = await new Network().start();

  // 1. Start SQL Server container
  dbContainer = await new GenericContainer("mcr.microsoft.com/mssql/server:2025-latest")
    .withEnvironment({
      ACCEPT_EULA: "Y",
      MSSQL_SA_PASSWORD: "YourStrongP@ssword123456789"
    })
    .withExposedPorts(1433)
    .withNetwork(network)
    .withNetworkAliases("sqlserver")
    .withWaitStrategy(Wait.forListeningPorts())
    .start();

  const dbHost = dbContainer.getHost();
  const dbPort = dbContainer.getMappedPort(1433);

  const connectionString =
    `Server=sqlserver;Database=ShopDb;User Id=sa;Password=YourStrongP@ssword123456789;TrustServerCertificate=True`;


  // 2. Start API container
  apiContainer = await new GenericContainer("api:latest") // build this beforehand
    .withEnvironment({
      "ConnectionStrings__DefaultConnection": connectionString
    })
    .withExposedPorts(8080)
    .withNetwork(network)
    .withWaitStrategy(Wait.forHttp("/health", 8080))
    .start();


  const apiUrl = `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(8080)}`;

   // 3. Expose to tests
  process.env.API_URL = apiUrl;

   // 4. Seed baseline data
  await fetch(process.env.API_URL + '/test/seed-db', {
    method: 'GET'
  });

  // Write for Angular to read (absolute path relative to this file)
  const tmpDir = resolve(__dirname, '../tmp');
  mkdirSync(tmpDir, { recursive: true });
  writeFileSync(resolve(tmpDir, 'api-url.json'), JSON.stringify({ apiUrl }));

  // Write container IDs for teardown to stop them
  writeFileSync(resolve(tmpDir, 'container-ids.json'), JSON.stringify({
    apiContainerId: apiContainer.getId(),
    dbContainerId: dbContainer.getId(),
    networkId: network.getId(),
  }));


});