import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { send } from 'ionicons/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getConversation, getMessages, markConversationRead, sendMessage } from '../../api/chatApi';
import Avatar from '../../components/Avatar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useConversationSocket } from '../../hooks/useConversationSocket';
import type { Conversation } from '../../types/message';
import type { Message } from '../../types/message';
import { hapticLight } from '../../utils/haptics';
import { getOtherUserFromConversation } from '../../utils/social';

function sortMessagesChronologically(messages: Message[]): Message[] {
  return [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
}

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const otherUser = user && conversation
    ? getOtherUserFromConversation(conversation, user.id)
    : undefined;

  const scrollToBottom = useCallback(async () => {
    await contentRef.current?.scrollToBottom(300);
  }, []);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const [conversationData, messageData] = await Promise.all([
        getConversation(conversationId),
        getMessages(conversationId),
      ]);
      setConversation(conversationData);
      setMessages(sortMessagesChronologically(messageData));
      await markConversationRead(conversationId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!loading) {
      void scrollToBottom();
    }
  }, [messages, loading, scrollToBottom]);

  const handleIncoming = useCallback((message: Message) => {
    setMessages((prev) => {
      if (prev.some((item) => item.id === message.id)) return prev;
      return sortMessagesChronologically([...prev, message]);
    });
  }, []);

  useConversationSocket(conversationId, handleIncoming);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body) return;
    void hapticLight();
    setSending(true);
    setError(null);
    try {
      const message = await sendMessage(conversationId, { body });
      setMessages((prev) => sortMessagesChronologically([...prev, message]));
      setDraft('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <IonPage className="chat-page">
      <IonHeader>
        <IonToolbar className="messenger-toolbar chat-header-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/chat" />
          </IonButtons>
          {otherUser ? (
            <div className="chat-header-user">
              <Avatar name={otherUser.name} userAvatar={otherUser.avatar} size="sm" />
              <span className="chat-header-name">{otherUser.name}</span>
            </div>
          ) : (
            <IonTitle>Chat</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className="chat-content">
        {loading ? <LoadingSpinner /> : null}
        <div className="chat-messages">
          {messages.map((message, index) => {
            const isMine = message.sender_id === user?.id;
            const showAvatar = !isMine && (
              index === 0 || messages[index - 1]?.sender_id !== message.sender_id
            );

            return (
              <div key={message.id} className={`chat-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                {!isMine ? (
                  <div className="chat-avatar-slot">
                    {showAvatar ? (
                      <Avatar
                        name={message.sender?.name ?? otherUser?.name}
                        userAvatar={message.sender?.avatar ?? otherUser?.avatar}
                        size="sm"
                      />
                    ) : null}
                  </div>
                ) : null}
                <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                  <p>{message.body}</p>
                  <span>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
      <IonFooter className="chat-footer">
        <IonToolbar className="chat-input-toolbar messenger-input-toolbar">
          <div className="messenger-input-wrap">
            <IonInput
              value={draft}
              placeholder="Aa"
              className="messenger-input"
              onIonInput={(e) => setDraft(e.detail.value ?? '')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleSend();
                }
              }}
            />
            <IonButton
              fill="clear"
              className="messenger-send-btn"
              onClick={handleSend}
              disabled={sending || !draft.trim()}
            >
              <IonIcon icon={send} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;
