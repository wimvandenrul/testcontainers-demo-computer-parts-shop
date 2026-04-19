// @ts-check
const { test: base, expect } = require('@playwright/test');

/**
 * Extend the base test with custom fixtures for the Computer Parts Shop app.
 * This provides reusable helpers for admin operations and common interactions.
 */
exports.test = base.extend({
  /**
   * Navigate to the admin page and wait for the page to load.
   */
  adminPage: async ({ page }, use) => {
    await use({
      goto: async () => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');
        // Wait for the loading spinner to disappear
        await page.waitForSelector('.spinner-border', { state: 'detached', timeout: 10000 }).catch(() => {});
      },
    });
  },

  /**
   * Navigate to the product list page.
   */
  productListPage: async ({ page }, use) => {
    await use({
      goto: async () => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.spinner-border', { state: 'detached', timeout: 10000 }).catch(() => {});
      },
    });
  },

  /**
   * Navigate to the cart page.
   */
  cartPage: async ({ page }, use) => {
    await use({
      goto: async () => {
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');
      },
    });
  },

  /**
   * Helper to create a product via the admin page.
   */
  createProduct: async ({ page }, use) => {
    await use(async (productData) => {
      const { name, description, price, category } = productData;
      
      // Click "Add Product" button
      await page.getByRole('button', { name: /Add Product/i }).click();
      
      // Wait for modal to appear
      await page.waitForSelector('.modal.show', { state: 'visible' });
      
      // Fill in the form
      await page.getByLabel('Name').fill(name);
      await page.getByLabel('Description').fill(description);
      await page.getByLabel('Price').fill(String(price));
      
      // Select category from dropdown
      await page.getByLabel('Category').selectOption({ label: category });
      
      // Click "Add" button to save
      await page.getByRole('button', { name: /^Add$/i }).click();
      
      // Wait for modal to close
      await page.waitForSelector('.modal.show', { state: 'detached', timeout: 5000 });
      
      // Verify success - check that product appears in the table
      await expect(page.getByText(name)).toBeVisible({ timeout: 5000 });
    });
  },

  /**
   * Helper to delete a product by name.
   */
  deleteProductByName: async ({ page }, use) => {
    await use(async (productName) => {
      // Find the row with the product name and click Delete
      const productRow = page.locator('tr', { has: page.getByText(productName, { exact: false }) });
      await productRow.getByRole('button', { name: 'Delete' }).click();
      
      // Accept the confirmation dialog
      page.once('dialog', dialog => dialog.accept());
      
      // Wait for product to be removed from the table
      await expect(page.getByText(productName)).not.toBeVisible({ timeout: 5000 });
    });
  },
});

exports.expect = expect;
