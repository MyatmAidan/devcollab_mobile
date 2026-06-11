import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import { Browser } from '@capacitor/browser';
import React, { useState } from 'react';
import { getErrorMessage } from '../../api/axios';
import {
  buildTelegramBotUrl,
  createTelegramLinkToken,
  disconnectTelegram,
  sendTelegramTest,
  updateTelegramSettings,
} from '../../api/telegramApi';
import { useAuth } from '../../hooks/useAuth';

const TelegramSettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [notifyEnabled, setNotifyEnabled] = useState(user?.telegram_notify_enabled ?? false);

  const isLinked = !!user?.telegram_linked_at;

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const link = await createTelegramLinkToken();
      const url = buildTelegramBotUrl(link.token);
      await Browser.open({ url });
      setSuccess('Telegram opened. Complete linking in the bot, then return here.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    try {
      await sendTelegramTest();
      setSuccess('Test notification sent.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    setNotifyEnabled(enabled);
    setError(null);
    try {
      await updateTelegramSettings(enabled);
      await refreshUser();
      setSuccess('Telegram notification settings updated.');
    } catch (err) {
      setNotifyEnabled(!enabled);
      setError(getErrorMessage(err));
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await disconnectTelegram();
      setNotifyEnabled(false);
      await refreshUser();
      setSuccess('Telegram disconnected.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/settings" />
          </IonButtons>
          <IonTitle>Telegram</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>
            <h2>Connection Status</h2>
            <p>{isLinked ? `Connected as @${user?.telegram_username ?? 'linked'}` : 'Not connected'}</p>
          </IonLabel>
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={handleConnect} disabled={loading}>
          Connect Telegram
        </IonButton>
        <IonButton expand="block" fill="outline" onClick={handleTest} disabled={loading || !isLinked}>
          Send Test Notification
        </IonButton>

        <IonItem className="ion-margin-top">
          <IonLabel>Enable Telegram Notifications</IonLabel>
          <IonToggle
            checked={notifyEnabled}
            disabled={!isLinked}
            onIonChange={(e) => handleToggle(e.detail.checked)}
          />
        </IonItem>

        <IonButton expand="block" color="danger" fill="outline" onClick={handleDisconnect} disabled={loading || !isLinked}>
          Disconnect Telegram
        </IonButton>

        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
        <IonToast isOpen={!!success} message={success ?? ''} duration={3000} color="success" onDidDismiss={() => setSuccess(null)} />
      </IonContent>
    </IonPage>
  );
};

export default TelegramSettingsPage;
