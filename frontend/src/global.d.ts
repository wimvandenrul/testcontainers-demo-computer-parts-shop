export {};

declare global {
  interface Window {
    /** API URL injected by Playwright e2e tests for Testcontainers integration */
    __E2E_API_URL?: string;
  }
}
