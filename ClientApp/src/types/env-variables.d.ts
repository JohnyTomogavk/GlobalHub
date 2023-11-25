export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      BUDGETS_SERVICE_BASE: string;
      NOTES_SERVICE_BASE: string;
      IDENTITY_SERVICE_BASE: string;
      CLIENT_ID: string;
      REDIRECT_URI: string;
      POST_LOGOUT_REDIRECT_URI: string;
    };
  }
}
