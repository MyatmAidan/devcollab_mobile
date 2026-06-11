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
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/notificationApi';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Notification } from '../../types/user';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
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
          <IonTitle>Notifications</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => markAllNotificationsRead().then(load)}>
            Read all
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {!loading && notifications.length === 0 ? <EmptyState title="No notifications" /> : null}
        <IonList>
          {notifications.map((notification) => (
            <IonItem
              key={notification.id}
              button
              onClick={() => markNotificationRead(notification.id).then(load)}
            >
              <IonLabel>
                <h2>{notification.title}</h2>
                <p>{notification.body}</p>
                <p>{new Date(notification.created_at).toLocaleString()}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
