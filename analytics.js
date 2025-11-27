import { inject } from '@vercel/analytics';

// Suppress Vercel Analytics error messages in production
// These errors occur when Web Analytics isn't enabled or is blocked by ad blockers
if (typeof window !== 'undefined') {
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('[Vercel Web Analytics]')) {
      // Suppress analytics error messages silently
      return;
    }
    originalConsoleLog.apply(console, args);
  };
}

try {
  inject({ debug: false, mode: 'production' });
} catch (error) {
  // Fail silently - analytics may be blocked by ad blockers or not enabled
}

