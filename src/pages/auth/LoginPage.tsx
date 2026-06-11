import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonToast,
} from '@ionic/react';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import BrandLogo from '../../components/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { hapticMedium } from '../../utils/haptics';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    void hapticMedium();
    setSubmitting(true);
    clearError();
    try {
      await login({ email, password });
      history.replace('/tabs/home');
    } catch {
      // Error handled in context.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="auth-page">
        <div className="auth-container">
          <div className="auth-brand">
            <BrandLogo className="auth-logo-img" />
          </div>
          <p className="auth-subtitle">Find your next dev collaborator</p>
          <div className="auth-card">
            <form onSubmit={handleSubmit}>
              <IonItem lines="full">
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                  required
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                  required
                />
              </IonItem>
              <IonButton expand="block" type="submit" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
              </IonButton>
            </form>
          </div>
          <p className="auth-footer">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
        <IonToast
          isOpen={!!error}
          message={error ?? ''}
          duration={3000}
          color="danger"
          onDidDismiss={clearError}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
