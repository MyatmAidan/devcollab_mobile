import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/react';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { extractErrors } from '../../api/axios';
import BrandLogo from '../../components/BrandLogo';
import FormErrors from '../../components/FormErrors';
import { useAuth } from '../../hooks/useAuth';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';
import { hapticMedium } from '../../utils/haptics';

type Mode = 'developer' | 'company';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const { login: devLogin } = useAuth();
  const { login: companyLogin } = useCompanyAuth();

  const [mode, setMode] = useState<Mode>('developer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setErrors([]);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    void hapticMedium();
    setErrors([]);
    setSubmitting(true);
    try {
      if (mode === 'developer') {
        await devLogin({ email, password });
        history.replace('/tabs/home');
      } else {
        await companyLogin({ email, password });
        history.replace('/company/tabs/jobs');
      }
    } catch (err) {
      setErrors(extractErrors(err, 'Login failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const isCompany = mode === 'company';

  return (
    <IonPage>
      <IonContent className="auth-page">
        <div className="auth-container">
          <div className="auth-brand">
            <BrandLogo className="auth-logo-img" />
          </div>
          <p className="auth-subtitle">
            {isCompany ? 'Manage your jobs and applicants' : 'Find your next dev collaborator'}
          </p>

          {/* Mode switch */}
          <IonSegment
            value={mode}
            onIonChange={(e) => handleModeSwitch(e.detail.value as Mode)}
            style={{ marginBottom: '1.25rem', borderRadius: 12 }}
          >
            <IonSegmentButton value="developer">
              <IonLabel>Developer</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="company">
              <IonLabel>Company</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <div className="auth-card">
            <form onSubmit={handleSubmit}>
              <IonItem lines="full">
                <IonLabel position="stacked">
                  {isCompany ? 'Company Email' : 'Email'}
                </IonLabel>
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

              <FormErrors errors={errors} style={{ margin: '10px 0 4px' }} />

              <IonButton
                expand="block"
                type="submit"
                disabled={submitting}
                style={{ marginTop: 8 }}
                color={isCompany ? 'secondary' : 'primary'}
              >
                {submitting
                  ? <IonSpinner name="crescent" />
                  : isCompany ? 'Sign In as Company' : 'Sign In'}
              </IonButton>
            </form>
          </div>

          {mode === 'developer' ? (
            <p className="auth-footer">
              New here? <Link to="/register">Create an account</Link>
            </p>
          ) : null}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
