import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { peopleOutline } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getMyProfile } from '../../api/profileApi';
import BrandLogo from '../../components/BrandLogo';

const OnboardingPage: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const checkProfile = async () => {
      const profile = await getMyProfile();
      if (profile) {
        history.replace('/tabs/home');
      }
    };
    void checkProfile();
  }, [history]);

  return (
    <IonPage>
      <IonContent className="auth-page">
        <div className="onboarding-hero">
          <div className="onboarding-brand">
            <BrandLogo variant="icon" className="onboarding-icon-img" alt="" />
          </div>
          <h1>Welcome to DevCollab</h1>
          <p>
            Set up your developer profile so others can discover and connect with you.
            Build your network, find collaborators, and grow together.
          </p>
        </div>
        <div className="onboarding-actions">
          <IonButton expand="block" onClick={() => history.push('/profile/create')}>
            <IonIcon icon={peopleOutline} slot="start" />
            Create Profile
          </IonButton>
          <IonButton expand="block" fill="clear" color="medium" onClick={() => history.replace('/tabs/discover')}>
            Skip for now
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OnboardingPage;
