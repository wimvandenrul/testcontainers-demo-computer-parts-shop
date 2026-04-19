import { test as teardown } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

teardown('remove test containers', async () => {
  console.log('stopping test containers...');

  const tmpDir = resolve(__dirname, '../tmp');
  const containerIdsPath = resolve(tmpDir, 'container-ids.json');

  if (existsSync(containerIdsPath)) {
    const { apiContainerId, dbContainerId } = JSON.parse(
      readFileSync(containerIdsPath, 'utf8')
    );

    // Use Docker API directly to stop containers by ID
    const Dockerode = (await import('dockerode')).default;
    const docker = new Dockerode();

    try {
      const apiDockerContainer = docker.getContainer(apiContainerId);
      await apiDockerContainer.stop();
      console.log('API container stopped');
    } catch (err) {
      console.error('Failed to stop API container:', err);
    }

    try {
      const dbDockerContainer = docker.getContainer(dbContainerId);
      await dbDockerContainer.stop();
      console.log('DB container stopped');
    } catch (err) {
      console.error('Failed to stop DB container:', err);
    }

    console.log('Container cleanup complete');
  } else {
    console.log('No container IDs found, skipping teardown');
  }
});
