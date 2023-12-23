export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      API_GATEWAY_URL: string;
      CLIENT_ID: string;
      REDIRECT_URI: string;
      POST_LOGOUT_REDIRECT_URI: string;
    };
  }
}
