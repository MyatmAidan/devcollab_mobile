import { useCallback, useEffect, useState } from 'react';
import { getEcho } from '../services/echoService';

interface PresenceMember {
  id: string;
  name: string;
}

/**
 * Joins the global `online` presence channel and tracks which user IDs
 * are currently active. Call once at app root while authenticated.
 */
export function useOnlinePresence(enabled: boolean) {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) {
      setOnlineIds(new Set());
      return;
    }

    let cancelled = false;

    const subscribe = async () => {
      const echo = await getEcho();
      if (!echo || cancelled) return;

      const channel = echo.join('online');

      channel.here((members: PresenceMember[]) => {
        if (!cancelled) {
          setOnlineIds(new Set(members.map((m) => String(m.id))));
        }
      });

      channel.joining((member: PresenceMember) => {
        if (!cancelled) {
          setOnlineIds((prev) => new Set([...prev, String(member.id)]));
        }
      });

      channel.leaving((member: PresenceMember) => {
        if (!cancelled) {
          setOnlineIds((prev) => {
            const next = new Set(prev);
            next.delete(String(member.id));
            return next;
          });
        }
      });

      channel.error((error: unknown) => {
        console.warn('[presence] online channel error', error);
      });
    };

    void subscribe();

    return () => {
      cancelled = true;
      void getEcho().then((echo) => {
        if (echo) echo.leave('online');
      });
    };
  }, [enabled]);

  const isUserOnline = useCallback(
    (userId: string) => onlineIds.has(String(userId)),
    [onlineIds],
  );

  return { onlineIds, isUserOnline };
}
