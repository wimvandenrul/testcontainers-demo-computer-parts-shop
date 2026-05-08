import { Order } from '../../src/app/models/order.model';
import { test, expect, dbFixture } from "./test-fixture";
import { ProductListPage, Header, CartPage } from "../pages";

test.describe("Checkout - submit order", () => {
  let productListPage: ProductListPage;
  let header: Header;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productListPage = new ProductListPage(page);
    header = new Header(page);
    cartPage = new CartPage(page);

    console.log('API URL found:', process.env.API_URL);

    // temporary CI workaround
    await new Promise(resolve => setTimeout(resolve, 15000));
    await dbFixture.resetDb();
  });

  test("submit order when having items in cart", async ({ page }) => {
    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/categories") && res.ok()),
      page.waitForResponse((res) => res.url().includes("/products") && res.ok()),
      productListPage.goto(),
    ]);

    const addButtons = await productListPage.getAddToCartButtons();
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    await expect(header.cartBadge).toHaveText("1");

    await header.navigateToCart();
    await expect(cartPage.checkoutButton).toBeVisible();
    await cartPage.checkoutButton.click();

    await expect(page).toHaveURL(/\/checkout$/);

    await page.locator('input[name="firstName"]').fill("John");
    await page.locator('input[name="lastName"]').fill("Doe");
    await page.locator('input[name="email"]').fill("john.doe@example.com");
    await page.locator('input[name="address"]').fill("123 Main St");
    await page.locator('input[name="city"]').fill("Antwerp");
    await page.locator('input[name="zipCode"]').fill("2000");
    await page.locator('input[name="country"]').fill("Belgium");

    const submitOrderButton = page.getByRole("button", { name: /Submit Order/i });
    await expect(submitOrderButton).toBeEnabled();

    // Wait for the API call and response
    const orderResponsePromise = page.waitForResponse((res) =>
      res.request().method() === "POST" && /\/api\/orders$/.test(res.url())
    );

    await submitOrderButton.click();
    const orderResponse = await orderResponsePromise;

    // Verify the order submission succeeded
    if (!orderResponse.ok()) {
      const body = await orderResponse.text();
      throw new Error(`POST /api/orders failed with ${orderResponse.status()}: ${body}`);
    }

    const order = await orderResponse.json() as Order;

    // Verify success message
    await expect(page.getByRole("heading", { name: /Order Submitted Successfully!/i })).toBeVisible();
    await expect(page.getByText(`Order ID: ${order.id}`)).toBeVisible();

    // Wait for cart badge to disappear (gives time for clearCart() to run and Angular to re-render)
    await expect(header.cartBadge).toHaveCount(0);

    // Verify order was saved in database
    const apiUrl = process.env.API_URL;
    const ordersResponse = await page.request.get(`${apiUrl}/api/orders`);
    if (!ordersResponse.ok()) {
      const body = await ordersResponse.text();
      throw new Error(`GET /api/orders failed with ${ordersResponse.status()}: ${body}`);
    }
    const orders = await ordersResponse.json() as any[];
    if (!Array.isArray(orders)) {
      throw new Error(`Expected orders to be an array, got: ${typeof orders}`);
    }

    const submittedOrder = orders.find((o: any) => o.email === 'john.doe@example.com');
    expect(submittedOrder).toBeTruthy();
    expect(submittedOrder.orderId).toMatch(/^ORD-\d+$/);
    expect(submittedOrder.firstName).toBe('John');
    expect(submittedOrder.lastName).toBe('Doe');
    expect(submittedOrder.total).toBeGreaterThan(0);
    expect(submittedOrder.items.length).toBe(1);
  });
});
