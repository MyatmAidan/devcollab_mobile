import { useEffect } from 'react';
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

export function useConversationSocket(
  conversationId: string | undefined,
  onMessage: (message: Message) => void,
): void {
  useEffect(() => {
    if (!conversationId) return;

    let channel: ReturnType<Echo<'reverb'>['private']> | null = null;
    let cancelled = false;

    const subscribe = async () => {
      const echo = await getEcho();
      if (!echo || cancelled) return;

      channel = echo.private(`conversation.${conversationId}`);
      channel.listen('.message.sent', (event: MessageSentEvent) => {
        onMessage({
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
                telegram_username: null,
                telegram_notify_enabled: false,
                telegram_linked_at: null,
                created_at: '',
              }
            : undefined,
        });
      });
    };

    void subscribe();

    return () => {
      cancelled = true;
      if (channel) {
        channel.stopListening('.message.sent');
      }
      void getEcho().then((echo) => {
        if (echo) {
          echo.leave(`conversation.${conversationId}`);
        }
      });
    };
  }, [conversationId, onMessage]);
}
