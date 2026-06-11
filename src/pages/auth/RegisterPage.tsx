import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
} from '@ionic/react';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { extractErrors } from '../../api/axios';
import BrandLogo from '../../components/BrandLogo';
import FormErrors from '../../components/FormErrors';
import { useAuth } from '../../hooks/useAuth';
import { hapticMedium } from '../../utils/haptics';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    void hapticMedium();
    setErrors([]);
    setSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      history.replace('/onboarding');
    } catch (err) {
      setErrors(extractErrors(err, 'Registration failed. Please try again.'));
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
          <h1 className="auth-heading">Create your account</h1>
          <p className="auth-subtitle">Connect with developers worldwide</p>
          <div className="auth-card">
            <form onSubmit={handleSubmit}>
              <IonItem lines="full">
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput value={name} onIonInput={(e) => setName(e.detail.value ?? '')} required />
              </IonItem>
              <IonItem lines="full">
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                  required
                />
              </IonItem>
              <IonItem lines="full">
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                  required
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Confirm Password</IonLabel>
                <IonInput
                  type="password"
                  value={passwordConfirmation}
                  onIonInput={(e) => setPasswordConfirmation(e.detail.value ?? '')}
                  required
                />
              </IonItem>

              <FormErrors errors={errors} style={{ margin: '10px 0 4px' }} />

              <IonButton expand="block" type="submit" disabled={submitting} style={{ marginTop: 8 }}>
                {submitting ? 'Creating account...' : 'Create Account'}
              </IonButton>
            </form>
          </div>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
