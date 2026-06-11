import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { createMeeting } from '../../api/meetingApi';

const CreateMeetingPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString());
  const [meetingUrl, setMeetingUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const participantId = params.get('participantId') ?? '';
  const connectionId = params.get('connectionId') ?? undefined;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!participantId) {
      setError('Participant is required. Open this page from a connection.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createMeeting({
        participant_id: participantId,
        connection_id: connectionId,
        title,
        description,
        scheduled_at: scheduledAt,
        meeting_url: meetingUrl || undefined,
        duration_minutes: 30,
      });
      history.replace('/meetings');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/meetings" />
          </IonButtons>
          <IonTitle>Create Meeting</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput value={title} onIonInput={(e) => setTitle(e.detail.value ?? '')} required />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea value={description} onIonInput={(e) => setDescription(e.detail.value ?? '')} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Scheduled At</IonLabel>
            <IonDatetime
              value={scheduledAt}
              onIonChange={(e) => setScheduledAt(e.detail.value as string)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Meeting URL</IonLabel>
            <IonInput value={meetingUrl} onIonInput={(e) => setMeetingUrl(e.detail.value ?? '')} />
          </IonItem>
          <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Meeting'}
          </IonButton>
        </form>
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default CreateMeetingPage;
