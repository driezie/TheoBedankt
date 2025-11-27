import { inject } from '@vercel/analytics';

try {
  inject({ debug: false, mode: 'production' });
} catch (error) {
  // Fail silently - analytics may be blocked by ad blockers or not enabled
}

