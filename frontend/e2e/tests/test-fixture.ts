import { test as base, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';


type Account = {

};

// Note that we pass worker fixture types as a second template parameter.
export const test = base.extend<{}, { account: Account }>({
  account: [async ({ browser }, use, workerInfo) => {

    console.log('Setting up account fixture for worker:', workerInfo.workerIndex);

    await use({});
  }, { scope: 'worker' }],

  page: async ({ page, account }, use) => {

    console.log('Injecting API URL into page...');

    // Read the API URL written by global-setup.ts
    const configPath = resolve(__dirname, '../tmp/api-url.json');
    if (existsSync(configPath)) {
      const { apiUrl } = JSON.parse(
        readFileSync(configPath, 'utf8')
      ) as { apiUrl: string };

      if (apiUrl) {
        console.log('API URL found:', apiUrl);
        process.env.API_URL = apiUrl;
      }

      // Inject before any page navigation so Angular can read it
      await page.addInitScript(
        `window.__E2E_API_URL = '${apiUrl}';`
      );
    }

    await use(page);
  },
});


export const dbFixture = {
  resetDb: async () => {
    console.log('Resetting database to baseline state...');

    console.log('URL to reset DB:', process.env.API_URL + '/test/reset-db');

    try {
      const response = await fetch(process.env.API_URL + '/test/reset-db', {
        method: 'GET'
      });

      console.log('status', response.status);

      const body = await response.text();
      console.log('body', body);
    }
    catch (error: any) {
      console.error('FETCH FAILED');
      console.error('message:', error?.message);
      console.error('stack:', error?.stack);
      console.error('cause:', error?.cause);

      if (error?.cause) {
        console.error('cause.code:', error.cause.code);
        console.error('cause.errno:', error.cause.errno);
        console.error('cause.syscall:', error.cause.syscall);
        console.error('cause.address:', error.cause.address);
        console.error('cause.port:', error.cause.port);
      }

      console.error('API_URL:', process.env.API_URL);

      throw error;
    }

  }
}

export { expect } from '@playwright/test';