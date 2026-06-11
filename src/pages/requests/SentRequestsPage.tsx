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
import { getErrorMessage } from '../../api/axios';
import { cancelRequest, getSentRequests } from '../../api/connectionApi';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { ConnectionRequest } from '../../types/connection';

const SentRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getSentRequests();
      setRequests(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sent Requests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {!loading && requests.length === 0 ? <EmptyState title="No sent requests" /> : null}
        <IonList>
          {requests.map((request) => (
            <IonItem key={request.id}>
              <IonLabel>
                <h2>{request.receiver?.name ?? 'Developer'}</h2>
                <p>{request.status}</p>
              </IonLabel>
              {request.status === 'pending' ? (
                <IonButton slot="end" size="small" fill="outline" onClick={() => cancelRequest(request.id).then(load)}>
                  Cancel
                </IonButton>
              ) : null}
            </IonItem>
          ))}
        </IonList>
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default SentRequestsPage;
