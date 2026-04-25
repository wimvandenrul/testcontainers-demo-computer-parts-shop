import { test, expect, dbFixture } from "./test-fixture";
import { ProductListPage, Header } from '../pages';

test.describe('Product List Page', () => {

  let productListPage: ProductListPage;
  let header: Header;

  test.beforeEach(async ({ page }) => {
    productListPage = new ProductListPage(page);
    header = new Header(page);
    await dbFixture.resetDb(); // Reset the database to a known state before each test
  });


  test('should display all categories', async ({ page }) => {

    // Navigate to the product list page
    await productListPage.goto();

    await page.waitForResponse(res =>
      res.url().includes('/categories') && res.ok()
    );

    await expect(productListPage.categorySections).toHaveCount(8);
  });

  test('verify category order', async ({ page }) => {

    // Navigate to the product list page
    await productListPage.goto();

    // Wait for the category sections to be visible
    await expect(productListPage.categorySections.first()).toBeVisible();

    await expect(productListPage.categorySections.nth(0).locator('h2')).toContainText('Cpu');

    await expect(productListPage.categorySections.nth(1).locator('h2')).toContainText('Gpu');

    await expect(productListPage.categorySections.nth(2).locator('h2')).toContainText('123');
  });

});

