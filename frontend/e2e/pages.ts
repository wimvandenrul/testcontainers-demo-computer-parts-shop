import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the Admin page.
 * Encapsulates all admin-related interactions for cleaner tests.
 */
export class AdminPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly addProductButton: Locator;
  readonly productTable: Locator;
  readonly productRows: Locator;
  readonly loadingSpinner: Locator;

  // Modal locators
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly priceInput: Locator;
  readonly categorySelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: /Product Administration/i });
    this.addProductButton = page.getByRole('button', { name: /Add Product/i });
    this.productTable = page.locator('table.table');
    this.productRows = page.locator('tbody tr');
    this.loadingSpinner = page.locator('.spinner-border');

    // Modal locators
    this.modal = page.locator('.modal.show');
    this.modalTitle = page.locator('.modal-title');
    this.nameInput = page.getByLabel('Name');
    this.descriptionInput = page.getByLabel('Description');
    this.priceInput = page.getByLabel('Price');
    this.categorySelect = page.locator('select#category');
    this.saveButton = page.getByRole('button', { name: /^Add$|^Update$/i });
    this.cancelButton = page.getByRole('button', { name: /Cancel/i });
    this.formError = page.locator('.alert-danger');
  }

  async goto() {
    await this.page.goto('/admin', { waitUntil: 'domcontentloaded' });
    // Wait for loading to finish
    await this.loadingSpinner.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  }

  async clickAddProduct() {
    await this.addProductButton.click();
    await this.modal.waitFor({ state: 'visible', timeout: 5000 });
  }

  async fillProductForm(data: { name: string; description: string; price: string | number; category: string }) {
    await this.nameInput.fill(data.name);
    await this.descriptionInput.fill(data.description);
    await this.priceInput.fill(String(data.price));
    await this.categorySelect.selectOption({ label: data.category });
  }

  async clickSave() {
    await this.saveButton.click();
    // Wait for modal to close
    await this.modal.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.modal.waitFor({ state: 'detached', timeout: 5000 });
  }

  async isProductVisible(productName: string): Promise<boolean> {
    return this.page.getByText(productName, { exact: false }).isVisible();
  }

  async getProductRow(productName: string): Promise<Locator> {
    return this.productRows.filter({ hasText: productName });
  }

  async clickEditProduct(productName: string) {
    const row = await this.getProductRow(productName);
    await row.getByRole('button', { name: /Edit/i }).click();
    await this.modal.waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickDeleteProduct(productName: string) {
    const row = await this.getProductRow(productName);
    await row.getByRole('button', { name: /Delete/i }).click();
    
    // Handle the browser confirmation dialog
    this.page.once('dialog', dialog => dialog.accept());
    
    // Wait for product to disappear
    await this.page.getByText(productName).waitFor({ state: 'hidden', timeout: 5000 });
  }

  async getTableText(): Promise<string> {
    return this.productTable.innerText();
  }

  async getFormValues(): Promise<{ name: string; description: string; price: string; category: string }> {
    return {
      name: await this.nameInput.inputValue(),
      description: await this.descriptionInput.inputValue(),
      price: await this.priceInput.inputValue(),
      category: await this.categorySelect.inputValue(),
    };
  }

  async getFormErrorText(): Promise<string | null> {
    const isVisible = await this.formError.isVisible();
    if (isVisible) {
      return this.formError.innerText();
    }
    return null;
  }
}

/**
 * Page Object for the Product List page.
 */
export class ProductListPage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly categorySections: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('#product-list .spinner-border');
    this.categorySections = page.locator('section');
    this.productCards = page.locator('app-product-card');
  }

  async goto() {
    await this.page.goto('/');
    //await this.page.waitForLoadState('networkidle');
    //await this.loadingSpinner.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  }

  async isProductVisible(productName: string): Promise<boolean> {
    return this.page.getByText(productName).isVisible();
  }

  async getAddToCartButtons(): Promise<Locator> {
    return this.page.getByRole('button', { name: /Add/i });
  }
}

/**
 * Page Object for the Cart page.
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly orderSummary: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.card'); // Cart items use the card class
    this.orderSummary = page.locator('.order-summary');
    this.checkoutButton = page.getByRole('button', { name: /Proceed to Checkout/i });
  }

  async goto() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async isItemInCart(productName: string): Promise<boolean> {
    return this.page.getByText(productName).isVisible();
  }

  async getCartItem(productName: string): Promise<Locator> {
    return this.page.locator('.card', { has: this.page.getByText(productName) });
  }
}

/**
 * Page Object for the Header/Navigation component.
 */
export class Header {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly adminLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsLink = page.getByRole('link', { name: /Products/i });
    this.adminLink = page.getByRole('link', { name: /Admin/i });
    this.cartLink = page.getByRole('link', { name: /Cart/i });
    this.cartBadge = page.locator('.badge');
  }

  async navigateToProducts() {
    await this.productsLink.click();
    await this.page.waitForURL('/');
  }

  async navigateToAdmin() {
    await this.adminLink.click();
    await this.page.waitForURL('/admin');
  }

  async navigateToCart() {
    await this.cartLink.click();
    await this.page.waitForURL('/cart');
  }

  async getCartCount(): Promise<string> {
    await this.cartBadge.waitFor({ state: 'visible', timeout: 5000 });
    return this.cartBadge.innerText();
  }
}
