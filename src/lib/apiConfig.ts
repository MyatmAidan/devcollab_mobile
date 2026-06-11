function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

/** Axios base URL — supports absolute URLs or Vite-proxied relative paths like `/api/v1/mobile`. */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) {
    if (configured.startsWith('/') || configured.startsWith('http')) {
      return configured;
    }
  }
  return 'http://localhost:8000/api/v1/mobile';
}

/** Origin for storage URLs, broadcasting auth, etc. */
export function getApiRoot(): string {
  const configured = import.meta.env.VITE_API_ROOT?.trim();
  if (configured) {
    return trimTrailingSlashes(configured);
  }
  if (typeof window !== 'undefined') {
    return trimTrailingSlashes(window.location.origin);
  }
  return 'http://localhost:8000';
}
