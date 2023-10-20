// Returns environment variable either from window object that could be set by script during the ci/cd process
// or provided fallback variable
export const getEnvVar = (key: keyof typeof window.__RUNTIME_CONFIG__, fallback?: string): string => {
  let value: string = fallback as string;

  if (process.env.NODE_ENV === 'production') {
    try {
      value = window.__RUNTIME_CONFIG__[key];
    } catch {}
  }

  return value;
};
