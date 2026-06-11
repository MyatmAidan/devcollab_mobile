import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  calendarOutline,
  chatbubbleOutline,
  logOutOutline,
  notificationsOutline,
  paperPlaneOutline,
  personOutline,
  sendOutline,
} from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { hapticMedium } from '../../utils/haptics';

const SettingsPage: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    void hapticMedium();
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="settings-content">
        <div className="settings-profile-card">
          <div className="avatar-ring">
            <Avatar name={user?.name} userAvatar={user?.avatar} size="lg" />
          </div>
          <div className="settings-profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="settings-group">
          <IonList lines="full">
            <IonItem button detail onClick={() => history.push('/profile/edit')}>
              <IonIcon icon={personOutline} slot="start" />
              <IonLabel>Edit Profile</IonLabel>
            </IonItem>
            <IonItem button detail onClick={() => history.push('/requests/received')}>
              <IonIcon icon={chatbubbleOutline} slot="start" />
              <IonLabel>Connection Requests</IonLabel>
            </IonItem>
            <IonItem button detail onClick={() => history.push('/requests/sent')}>
              <IonIcon icon={sendOutline} slot="start" />
              <IonLabel>Sent Requests</IonLabel>
            </IonItem>
          </IonList>
        </div>

        <div className="settings-group">
          <IonList lines="full">
            <IonItem button detail onClick={() => history.push('/meetings')}>
              <IonIcon icon={calendarOutline} slot="start" />
              <IonLabel>Meetings</IonLabel>
            </IonItem>
            <IonItem button detail onClick={() => history.push('/notifications')}>
              <IonIcon icon={notificationsOutline} slot="start" />
              <IonLabel>Notifications</IonLabel>
            </IonItem>
            <IonItem button detail onClick={() => history.push('/settings/telegram')}>
              <IonIcon icon={paperPlaneOutline} slot="start" />
              <IonLabel>Telegram Notifications</IonLabel>
            </IonItem>
          </IonList>
        </div>

        <div className="settings-logout">
          <IonButton expand="block" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Log Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
