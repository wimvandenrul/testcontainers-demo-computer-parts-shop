# E2E Tests - Computer Parts Shop Frontend

End-to-end tests for the Angular Computer Parts Shop application using [Playwright](https://playwright.dev/).

## Test Structure

```
e2e/
├── playwright.config.ts    # Playwright configuration
├── pages.ts                # Page Object Models (POM)
├── fixtures.js             # Custom test fixtures
├── package.json            # E2E test dependencies
└── tests/
    ├── product-list.spec.ts       # Product list page tests
    ├── admin-create-product.spec.ts # Admin: Create product tests
    ├── admin-edit-product.spec.ts   # Admin: Edit product tests
    ├── admin-delete-product.spec.ts # Admin: Delete product tests
    ├── admin-form-validation.spec.ts # Admin: Form validation tests
    ├── cart.spec.ts                 # Cart functionality tests
    └── navigation.spec.ts           # Navigation & routing tests
```

## Test Coverage

### Product List Page
- Page loading and rendering
- Product display by category
- Product cards with "Add" buttons
- Navigation to other pages

### Admin - Create Product
- Open add product modal
- Create product with valid data
- Verify product appears in table
- Verify product appears on product list page
- Cancel product creation
- Close modal (backdrop, close button)

### Admin - Edit Product
- Open edit modal with pre-filled data
- Update product name, description, price, category
- Cancel editing without saving
- Verify updates persist

### Admin - Delete Product
- Delete product with confirmation
- Verify product removed from admin table
- Verify product removed from product list page
- Empty state when no products
- Cancel deletion
- Bulk delete operations

### Admin - Form Validation
- Required field validation (name, description, price, category)
- Price validation (must be > 0)
- Empty/whitespace validation
- Max length validation
- Decimal price acceptance
- Error message display and clearing

### Cart Functionality
- Add products to cart
- Cart count badge updates
- Multiple product additions
- Cart persistence (localStorage)
- Navigate to cart page
- Order summary display
- Checkout navigation
- Quantity updates
- Product removal
- Empty cart state

### Navigation & Routing
- Header navigation visibility
- Page-to-page navigation
- Unknown route redirection to home
- Active link highlighting
- Cart count preservation across pages
- Browser back/forward navigation
- Direct URL access
- State preservation on page reload

## Running Tests

### Prerequisites
- The backend API server must be running at `https://localhost:5001`
- Node.js 18+ installed

### Install Dependencies
```bash
cd e2e
npm install
```

### Run All Tests
```bash
# From project root
npm run e2e

# Or directly from e2e folder
cd e2e
npx playwright test
```

### Run Tests in UI Mode
```bash
npm run e2e:ui
```

### Run Tests in Debug Mode
```bash
npm run e2e:debug
```

### Run Specific Test File
```bash
npx playwright test admin-create-product
```

### Run on Specific Browser
```bash
# Chromium only
npx playwright test --project=chromium

# Mobile Chrome only
npx playwright test --project="Mobile Chrome"
```

### Generate HTML Report
```bash
npm run e2e:report
```

## Page Object Model

Tests use the Page Object Model pattern for maintainability. Key page objects:

- **AdminPage**: Admin page interactions (form filling, CRUD operations)
- **ProductListPage**: Product list page interactions
- **CartPage**: Cart page interactions
- **Header**: Navigation header interactions

## Test Data

Tests generate unique product names using timestamps to avoid conflicts:
```typescript
const timestamp = Date.now();
const productName = `Test Product ${timestamp}`;
```

## CI/CD Integration

Tests are configured to:
- Retry failed tests 2 times on CI
- Run sequentially (1 worker) on CI
- Generate HTML reports
- Take screenshots on failure
- Record video on failure

## Adding New Tests

1. Create a new `.spec.ts` file in `tests/`
2. Import page objects from `../pages`
3. Use `test.describe()` for test suites
4. Use `test.beforeEach()` for setup
5. Use `test()` for individual tests
6. Use `expect()` for assertions

Example:
```typescript
import { test, expect } from '@playwright/test';
import { AdminPage } from '../pages';

test.describe('New Feature', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.goto();
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.getByText('Expected')).toBeVisible();
  });
});
```
