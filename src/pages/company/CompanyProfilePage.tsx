import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';
import React, { useCallback, useEffect, useState } from 'react';
import { updateCompanyProfile } from '../../api/companyApi';
import { extractErrors, getErrorMessage } from '../../api/axios';
import Avatar from '../../components/Avatar';
import FormErrors from '../../components/FormErrors';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';

const CompanyProfilePage: React.FC = () => {
  const { company, refreshCompany, logout } = useCompanyAuth();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_name: '',
    contact_email: '',
    website: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (company) {
      setForm({
        company_name: company.company_name ?? '',
        contact_email: company.contact_email ?? '',
        website: company.website ?? '',
        location: company.location ?? '',
        description: company.description ?? '',
      });
    }
  }, [company]);

  const handleSave = async () => {
    setErrors([]);
    setSaving(true);
    try {
      await updateCompanyProfile(form);
      await refreshCompany();
      setToast('Profile saved.');
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof typeof form, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Company Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <Avatar
            name={company?.company_name}
            profilePhoto={company?.logo_url ?? company?.logo}
            size="lg"
          />
          <h2 style={{ margin: '10px 0 2px', fontWeight: 700 }}>{company?.company_name}</h2>
          <p style={{ color: 'var(--dc-text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {company?.company?.email}
          </p>
        </div>

        <div style={{ padding: '8px 4px' }}>
          <FormErrors errors={errors} />

          <IonItem>
            <IonLabel position="stacked">Company Name</IonLabel>
            <IonInput value={form.company_name} onIonInput={(e) => set('company_name', e.detail.value ?? '')} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contact Email</IonLabel>
            <IonInput type="email" value={form.contact_email} onIonInput={(e) => set('contact_email', e.detail.value ?? '')} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Website</IonLabel>
            <IonInput type="url" value={form.website} onIonInput={(e) => set('website', e.detail.value ?? '')} placeholder="https://example.com" />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Location</IonLabel>
            <IonInput value={form.location} onIonInput={(e) => set('location', e.detail.value ?? '')} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea
              value={form.description}
              onIonInput={(e) => set('description', e.detail.value ?? '')}
              rows={4}
              autoGrow
            />
          </IonItem>

          <div style={{ padding: '16px 12px' }}>
            <IonButton expand="block" onClick={handleSave} disabled={saving} style={{ '--border-radius': '12px' }}>
              {saving ? <IonSpinner name="crescent" /> : 'Save Changes'}
            </IonButton>
            <IonButton expand="block" fill="outline" color="danger" onClick={() => void logout()} style={{ '--border-radius': '12px', marginTop: 12 }}>
              Sign Out
            </IonButton>
          </div>
        </div>

        <IonToast
          isOpen={!!toast}
          message={toast ?? ''}
          duration={2500}
          color="success"
          onDidDismiss={() => setToast(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CompanyProfilePage;
