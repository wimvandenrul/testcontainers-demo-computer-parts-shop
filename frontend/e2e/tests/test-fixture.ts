import { test as base, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';


type Account = {

};

// Note that we pass worker fixture types as a second template parameter.
export const test = base.extend<{}, { account: Account }>({
  account: [async ({ browser }, use, workerInfo) => {

    console.log('Setting up account fixture for worker:', workerInfo.workerIndex);

    await use({  });
  }, { scope: 'worker' }],

  page: async ({ page, account }, use) => {
    
    console.log('Injecting API URL into page...');

    // Read the API URL written by global-setup.ts
    const configPath = resolve(__dirname, '../tmp/api-url.json');
    if (existsSync(configPath)) {
      const { apiUrl } = JSON.parse(
        readFileSync(configPath, 'utf8')
      ) as { apiUrl: string };

      if (apiUrl){
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

    // 4. Seed baseline data
    await fetch(process.env.API_URL + '/test/reset-db', {
      method: 'GET'
    });

  }
}

export { expect } from '@playwright/test';