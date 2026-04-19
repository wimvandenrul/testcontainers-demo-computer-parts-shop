export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && (window as any).__E2E_API_URL)
    ? (window as any).__E2E_API_URL + '/api'
    : 'https://localhost:5001/api',
};
