import {
  IonButton,
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
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { acceptRequest, getConnections, getReceivedRequests, rejectRequest } from '../../api/connectionApi';
import AnimatedEntrance from '../../components/AnimatedEntrance';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import type { Connection, ConnectionRequest } from '../../types/connection';
import { hapticLight, hapticMedium, hapticSuccess } from '../../utils/haptics';
import { getOtherUser } from '../../utils/social';

const ConnectionsPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [connectionData, requestData] = await Promise.all([
        getConnections(),
        getReceivedRequests(),
      ]);
      setConnections(connectionData);
      setRequests(requestData.filter((item) => item.status === 'pending'));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAccept = async (requestId: string) => {
    void hapticMedium();
    try {
      const connection = await acceptRequest(requestId);
      void hapticSuccess();
      await load();
      if (connection.conversation?.id) {
        history.push(`/chat/${connection.conversation.id}`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleReject = async (requestId: string) => {
    void hapticLight();
    try {
      await rejectRequest(requestId);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Connections</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="connections-content">
        {loading ? <LoadingSpinner /> : null}

        {!loading && requests.length > 0 ? (
          <div className="friend-requests-section">
            <h3 className="section-title">Connection Requests · {requests.length}</h3>
            {requests.map((request, index) => (
              <AnimatedEntrance key={request.id} index={index}>
                <div className="friend-request-card">
                  <div className="avatar-ring">
                    <Avatar
                      name={request.sender?.name}
                      userAvatar={request.sender?.avatar}
                      size="md"
                    />
                  </div>
                  <div className="friend-request-info">
                    <h2>{request.sender?.name ?? 'Developer'}</h2>
                    <p>{request.message || 'Wants to connect with you'}</p>
                  </div>
                  <div className="friend-request-actions">
                    <IonButton size="small" onClick={() => handleAccept(request.id)}>
                      Accept
                    </IonButton>
                    <IonButton
                      size="small"
                      fill="outline"
                      color="medium"
                      onClick={() => handleReject(request.id)}
                    >
                      Decline
                    </IonButton>
                  </div>
                </div>
              </AnimatedEntrance>
            ))}
          </div>
        ) : null}

        <h3 className="section-title">Your Connections · {connections.length}</h3>
        {!loading && connections.length === 0 ? (
          <EmptyState
            title="No connections yet"
            description="Discover developers and send connection requests."
          />
        ) : null}

        <IonList className="friends-list">
          {connections.map((connection, index) => {
            const other = user ? getOtherUser(connection, user.id) : undefined;
            const conversationId = connection.conversation?.id;
            return (
              <AnimatedEntrance key={connection.id} index={index}>
                <IonItem
                  button
                  detail={false}
                  className="friend-item"
                  onClick={() => conversationId && history.push(`/chat/${conversationId}`)}
                >
                  <div className="avatar-ring" slot="start">
                    <Avatar
                      name={other?.name}
                      userAvatar={other?.avatar}
                      size="md"
                    />
                  </div>
                  <IonLabel>
                    <h2>{other?.name ?? 'Connection'}</h2>
                    <p>Tap to message</p>
                  </IonLabel>
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

export default ConnectionsPage;
