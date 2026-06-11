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
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { acceptRequest, getReceivedRequests, rejectRequest } from '../../api/connectionApi';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { ConnectionRequest } from '../../types/connection';

const ReceivedRequestsPage: React.FC = () => {
  const history = useHistory();
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getReceivedRequests();
      setRequests(data.filter((item) => item.status === 'pending'));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const connection = await acceptRequest(id);
      await load();
      if (connection.conversation?.id) {
        history.push(`/chat/${connection.conversation.id}`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Friend Requests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {!loading && requests.length === 0 ? <EmptyState title="No pending requests" /> : null}
        <IonList>
          {requests.map((request) => (
            <IonItem key={request.id} className="friend-request-item">
              <Avatar
                slot="start"
                name={request.sender?.name}
                userAvatar={request.sender?.avatar}
                size="md"
              />
              <IonLabel>
                <h2>{request.sender?.name ?? 'Developer'}</h2>
                <p>{request.message || 'Sent you a friend request'}</p>
              </IonLabel>
              <IonButton slot="end" size="small" onClick={() => handleAccept(request.id)}>
                Confirm
              </IonButton>
              <IonButton slot="end" size="small" fill="outline" color="medium" onClick={() => rejectRequest(request.id).then(load)}>
                Delete
              </IonButton>
            </IonItem>
          ))}
        </IonList>
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default ReceivedRequestsPage;
