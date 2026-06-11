import { useEffect, useRef } from 'react';
import type Echo from 'laravel-echo';
import { getEcho } from '../services/echoService';
import type { Message } from '../types/message';

interface MessageSentEvent {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  type: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface TypingWhisper {
  userId: string;
}

export interface ConversationSocketCallbacks {
  onMessage: (message: Message) => void;
  onTyping?: (userId: string) => void;
}

export function useConversationSocket(
  conversationId: string | undefined,
  callbacks: ConversationSocketCallbacks,
): void {
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  useEffect(() => {
    if (!conversationId) return;

    let channel: ReturnType<Echo<'reverb'>['private']> | null = null;
    let cancelled = false;

    const subscribe = async () => {
      const echo = await getEcho();
      if (!echo || cancelled) return;

      channel = echo.private(`conversation.${conversationId}`);

      // Avoid duplicate handlers if subscribe runs more than once
      channel.stopListening('.message.sent');
      channel.stopListeningForWhisper('typing');

      channel.listen('.message.sent', (event: MessageSentEvent) => {
        cbRef.current.onMessage({
          id: event.id,
          conversation_id: event.conversation_id,
          sender_id: event.sender_id,
          body: event.body,
          type: event.type,
          read_at: null,
          created_at: event.created_at,
          sender: event.sender
            ? {
                id: event.sender.id,
                name: event.sender.name,
                avatar: event.sender.avatar,
                email: '',
                role: 'user',
                status: 'active',
                last_active_at: null,
                telegram_username: null,
                telegram_notify_enabled: false,
                telegram_linked_at: null,
                created_at: '',
              }
            : undefined,
        });
      });

      channel.listenForWhisper('typing', (event: TypingWhisper) => {
        cbRef.current.onTyping?.(event.userId);
      });
    };

    void subscribe();

    return () => {
      cancelled = true;
      if (channel) {
        channel.stopListening('.message.sent');
        channel.stopListeningForWhisper('typing');
      }
      void getEcho().then((echo) => {
        if (echo) echo.leave(`conversation.${conversationId}`);
      });
    };
  }, [conversationId]);
}

/** Send a typing whisper on the private conversation channel. */
export async function whisperTyping(conversationId: string, userId: string): Promise<void> {
  const echo = await getEcho();
  if (!echo) return;
  try {
    echo.private(`conversation.${conversationId}`).whisper('typing', { userId });
  } catch {
    // ignore if whispers unsupported
  }
}
