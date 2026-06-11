import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getConversations } from '../../api/chatApi';
import AnimatedEntrance from '../../components/AnimatedEntrance';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { useIsOnline } from '../../context/OnlinePresenceContext';
import type { Conversation } from '../../types/message';
import { formatMessageTime, getOtherUserFromConversation } from '../../utils/social';

const ConversationAvatar: React.FC<{ userId?: string; name?: string; avatar?: string | null }> = ({
  userId,
  name,
  avatar,
}) => {
  const online = useIsOnline(userId);
  return <Avatar name={name} userAvatar={avatar} isOnline={userId ? online : undefined} size="md" />;
};

const ConversationsPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="messenger-toolbar">
          <IonTitle>Messages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {!loading && conversations.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Accept a connection request to start chatting."
          />
        ) : null}
        <IonList className="messenger-list">
          {conversations.map((conversation, index) => {
            const other = user ? getOtherUserFromConversation(conversation, user.id) : undefined;
            const preview = conversation.last_message?.body ?? 'No messages yet';
            const time = formatMessageTime(
              conversation.last_message?.created_at ?? conversation.last_message_at,
            );
            const isMine = conversation.last_message?.sender_id === user?.id;
            const previewText = isMine ? `You: ${preview}` : preview;
            const hasUnread = !isMine && !!conversation.last_message;

            return (
              <AnimatedEntrance key={conversation.id} index={index}>
                <IonItem
                  button
                  detail={false}
                  className="messenger-thread-item"
                  onClick={() => history.push(`/chat/${conversation.id}`)}
                >
                  <div className="avatar-ring" slot="start">
                    <ConversationAvatar
                      userId={other?.id}
                      name={other?.name}
                      avatar={other?.avatar}
                    />
                  </div>
                  <IonLabel>
                    <div className="messenger-thread-row">
                      <h2>{other?.name ?? 'Chat'}</h2>
                      <span className="messenger-time">{time}</span>
                    </div>
                    <p className="messenger-preview">{previewText}</p>
                  </IonLabel>
                  {hasUnread ? <div className="messenger-unread-dot" slot="end" /> : null}
                </IonItem>
              </AnimatedEntrance>
            );
          })}
        </IonList>
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default ConversationsPage;
