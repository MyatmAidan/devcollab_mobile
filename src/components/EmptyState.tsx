import { IonIcon, IonText } from '@ionic/react';
import { fileTrayOutline } from 'ionicons/icons';
import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => (
  <div className="ion-text-center ion-padding empty-state">
    <div className="empty-state-icon">
      <IonIcon icon={fileTrayOutline} />
    </div>
    <h3>{title}</h3>
    {description ? (
      <IonText color="medium">
        <p>{description}</p>
      </IonText>
    ) : null}
  </div>
);

export default EmptyState;
