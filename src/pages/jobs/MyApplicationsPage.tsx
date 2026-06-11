import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/axios';
import { getMyApplications, withdrawApplication } from '../../api/jobApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { JobApplication } from '../../types/job';

const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await getMyApplications();
      setApplications(response.data);
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
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/jobs" text="Back" />
          </IonButtons>
          <IonTitle>My Applications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="ion-padding">{error}</p> : null}
        <IonList>
          {applications.map((application) => (
            <IonItem key={application.id}>
              <IonLabel>
                <h2>{application.job?.title ?? 'Job'}</h2>
                <p>{application.job?.company_profile?.company_name}</p>
                <p>Status: {application.status}</p>
              </IonLabel>
              {application.status === 'pending' || application.status === 'reviewed' ? (
                <IonButton
                  slot="end"
                  fill="outline"
                  onClick={() => void withdrawApplication(application.id).then(() => load())}
                >
                  Withdraw
                </IonButton>
              ) : null}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MyApplicationsPage;
