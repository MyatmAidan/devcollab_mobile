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

export async function getEcho(): Promise<Echo<'reverb'> | null> {
  if (typeof window === 'undefined') return null;

  const key = import.meta.env.VITE_REVERB_APP_KEY;
  if (!key || key === 'your_app_key') return null;

  if (!window.Pusher) {
    window.Pusher = Pusher;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const token = await getToken();
  const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
  const port = Number(import.meta.env.VITE_REVERB_PORT || 8080);
  const wsHost = import.meta.env.VITE_REVERB_HOST || 'localhost';
  const authEndpoint = `${getApiRoot()}/broadcasting/auth`;

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key,
    wsHost,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint,
    auth: {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  });

  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
