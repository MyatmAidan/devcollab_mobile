import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  IonIcon,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getMeetings } from '../../api/meetingApi';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Meeting } from '../../types/meeting';

const MeetingsPage: React.FC = () => {
  const history = useHistory();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMeetings();
        setMeetings(data);
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
        <IonToolbar>
          <IonTitle>Meetings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {!loading && meetings.length === 0 ? <EmptyState title="No meetings scheduled" /> : null}
        <IonList>
          {meetings.map((meeting) => (
            <IonItem key={meeting.id}>
              <IonLabel>
                <h2>{meeting.title}</h2>
                <p>{new Date(meeting.scheduled_at).toLocaleString()}</p>
                <p>{meeting.status}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/meetings/create')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default MeetingsPage;
