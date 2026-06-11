import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getApiRoot } from '../lib/apiConfig';
import { getToken } from './tokenService';

declare global {
  interface Window {
    Pusher?: typeof Pusher;
  }
}

let echoInstance: Echo<'reverb'> | null = null;

function getBroadcastAuthEndpoint(): string {
  const configured = import.meta.env.VITE_BROADCAST_AUTH_URL?.trim();
  if (configured) {
    return configured;
  }
  // Vite dev proxy forwards /broadcasting → Laravel (avoids CORS in browser)
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return `${window.location.origin}/broadcasting/auth`;
  }
  return `${getApiRoot()}/broadcasting/auth`;
}

export async function getEcho(): Promise<Echo<'reverb'> | null> {
  if (typeof window === 'undefined') return null;

  const key = import.meta.env.VITE_REVERB_APP_KEY;
  if (!key || key === 'your_app_key') return null;

  if (!window.Pusher) {
    window.Pusher = Pusher;
  }

  const token = await getToken();
  if (!token) return null;

  // Recreate Echo when auth token changes
  const existingToken = (echoInstance as Echo<'reverb'> & { __token?: string })?.__token;
  if (echoInstance && existingToken !== token) {
    echoInstance.disconnect();
    echoInstance = null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
  const port = Number(import.meta.env.VITE_REVERB_PORT || 8080);
  const wsHost = import.meta.env.VITE_REVERB_HOST || '127.0.0.1';

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key,
    wsHost,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: getBroadcastAuthEndpoint(),
    auth: {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  });

  (echoInstance as Echo<'reverb'> & { __token?: string }).__token = token;

  return echoInstance;
}

export async function getSocketId(): Promise<string | null> {
  const echo = await getEcho();
  if (!echo) return null;
  try {
    const id = echo.socketId();
    return id || null;
  } catch {
    return null;
  }
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
