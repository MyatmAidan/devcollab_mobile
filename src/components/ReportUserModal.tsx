import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';
import { getErrorMessage } from '../api/axios';
import { REPORT_REASONS, submitReport } from '../api/reportApi';

interface ReportUserModalProps {
  isOpen: boolean;
  reportedUserId: string;
  reportedUserName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReportUserModal: React.FC<ReportUserModalProps> = ({
  isOpen,
  reportedUserId,
  reportedUserName,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<string>(REPORT_REASONS[0].value);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDismiss = () => {
    setReason(REPORT_REASONS[0].value);
    setDescription('');
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitReport({
        reported_user_id: reportedUserId,
        reason,
        description: description.trim() || undefined,
      });
      onSuccess?.();
      handleDismiss();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleDismiss}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Report user</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p className="ion-margin-bottom">
          Report <strong>{reportedUserName}</strong> for violating community guidelines.
        </p>

        <IonItem>
          <IonLabel position="stacked">Reason</IonLabel>
          <IonSelect
            value={reason}
            onIonChange={(e) => setReason(e.detail.value as string)}
            interface="action-sheet"
          >
            {REPORT_REASONS.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Details (optional)</IonLabel>
          <IonTextarea
            value={description}
            placeholder="Describe what happened..."
            rows={4}
            onIonInput={(e) => setDescription(e.detail.value ?? '')}
          />
        </IonItem>

        {error ? <p className="ion-margin-top" style={{ color: 'var(--ion-color-danger)' }}>{error}</p> : null}

        <IonButton
          expand="block"
          color="danger"
          className="ion-margin-top"
          disabled={loading}
          onClick={() => void handleSubmit()}
        >
          Submit report
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default ReportUserModal;
