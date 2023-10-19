export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      BUDGETS_SERVICE_BASE: string;
      NOTES_SERVICE_BASE: string;
    };
  }
}
