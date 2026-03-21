/**
 * Unit tests for API URL environment configuration.
 *
 * Each constant is a module-level expression evaluated at load time, so we use
 * vi.resetModules() + dynamic import() to force re-evaluation with different
 * import.meta.env values for every test case.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Capture the original DEV flag so we can restore it after each test.
// In Vitest's default "test" mode, import.meta.env.DEV is true.
const originalDev = import.meta.env.DEV;

describe('API environment configuration', () => {
  beforeEach(() => {
    // Clear the module registry so each dynamic import re-evaluates the module
    // and picks up the env values set within the current test.
    vi.resetModules();
  });

  afterEach(() => {
    // Restore env vars stubbed via vi.stubEnv (e.g. VITE_API_URL).
    vi.unstubAllEnvs();
    // Restore the DEV flag modified via direct assignment.
    (import.meta.env as Record<string, unknown>).DEV = originalDev;
  });

  // ─── src/core/api/client.ts ────────────────────────────────────────────────

  describe('API_BASE_URL in src/core/api/client.ts', () => {
    it('is set to localhost in development when VITE_API_URL is not defined', async () => {
      vi.stubEnv('VITE_API_URL', '');
      (import.meta.env as Record<string, unknown>).DEV = true;

      const { API_BASE_URL } = await import('../core/api/client');

      expect(API_BASE_URL).toBe('http://localhost:3000/api');
    });

    it('is an empty string in production when VITE_API_URL is not defined', async () => {
      vi.stubEnv('VITE_API_URL', '');
      (import.meta.env as Record<string, unknown>).DEV = false;

      const { API_BASE_URL } = await import('../core/api/client');

      expect(API_BASE_URL).toBe('');
    });
  });

  // ─── src/services/api/client.ts ───────────────────────────────────────────

  describe('API_URL in src/services/api/client.ts', () => {
    it('is set to localhost in development when VITE_API_URL is not defined', async () => {
      vi.stubEnv('VITE_API_URL', '');
      (import.meta.env as Record<string, unknown>).DEV = true;

      const { API_URL } = await import('../services/api/client');

      expect(API_URL).toBe('http://localhost:3000/api');
    });

    it('is an empty string in production when VITE_API_URL is not defined', async () => {
      vi.stubEnv('VITE_API_URL', '');
      (import.meta.env as Record<string, unknown>).DEV = false;

      const { API_URL } = await import('../services/api/client');

      expect(API_URL).toBe('');
    });
  });

  // ─── src/services/email/brevo.ts ──────────────────────────────────────────

  describe('API_URL in src/services/email/brevo.ts', () => {
    it('is set to localhost in development when VITE_API_URL is not defined', async () => {
      vi.stubEnv('VITE_API_URL', '');
      (import.meta.env as Record<string, unknown>).DEV = true;

      const { API_URL } = await import('../services/email/brevo');

      expect(API_URL).toBe('http://localhost:3000');
    });
  });
});
