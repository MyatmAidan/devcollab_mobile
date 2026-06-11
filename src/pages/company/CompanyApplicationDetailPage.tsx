import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';
import { documentOutline, openOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApplication, updateApplication } from '../../api/companyApi';
import { getErrorMessage, extractErrors } from '../../api/axios';
import Avatar from '../../components/Avatar';
import FormErrors from '../../components/FormErrors';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { ApplicationStatus, JobApplicant } from '../../types/company';

const statusColor: Record<string, string> = {
  pending: 'warning',
  reviewing: 'primary',
  accepted: 'success',
  rejected: 'danger',
};

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const CompanyApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<JobApplicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ApplicationStatus>('pending');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getApplication(id);
      setApplication(data);
      setStatus(data.status);
      setNotes(data.company_notes ?? '');
    } catch (err) {
      setToast(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  const handleSave = async () => {
    setErrors([]);
    setSaving(true);
    try {
      const updated = await updateApplication(id, { status, company_notes: notes });
      setApplication(updated);
      setToast('Application updated.');
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setSaving(false);
    }
  };

  const dev = application?.developer_profile;
  const user = dev?.user;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/company/tabs/applications" />
          </IonButtons>
          <IonTitle>Application</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} disabled={saving || loading} strong>
              {saving ? <IonSpinner name="crescent" /> : 'Update'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}

        {!loading && application ? (
          <>
            {/* Applicant Info */}
            <IonCard style={{ margin: '12px 12px 0', borderRadius: 14 }}>
              <IonCardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Avatar name={user?.name} userAvatar={user?.avatar} size="md" />
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 700 }}>{user?.name ?? 'Applicant'}</h3>
                    <p style={{ margin: '2px 0 0', color: 'var(--dc-text-muted)', fontSize: '0.85rem' }}>
                      {user?.email}
                    </p>
                  </div>
                  <IonBadge color={statusColor[application.status] ?? 'medium'} style={{ marginLeft: 'auto' }}>
                    {application.status}
                  </IonBadge>
                </div>

                {dev ? (
                  <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {dev.category?.name_en ? (
                      <p style={{ margin: '2px 0' }}>
                        <strong>Specialization:</strong> {dev.category.name_en}
                      </p>
                    ) : null}
                    {dev.experience_level ? (
                      <p style={{ margin: '2px 0' }}>
                        <strong>Level:</strong> {dev.experience_level}
                      </p>
                    ) : null}
                    {dev.location ? (
                      <p style={{ margin: '2px 0' }}>
                        <strong>Location:</strong> {dev.location}
                      </p>
                    ) : null}
                    {dev.phone ? (
                      <p style={{ margin: '2px 0' }}>
                        <strong>Phone:</strong> {dev.phone}
                      </p>
                    ) : null}
                    {dev.bio ? (
                      <p style={{ margin: '8px 0 0' }}>{dev.bio}</p>
                    ) : null}
                  </div>
                ) : null}

                {dev?.cv_url ? (
                  <IonButton
                    fill="outline"
                    size="small"
                    style={{ marginTop: 12 }}
                    href={dev.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IonIcon icon={documentOutline} slot="start" />
                    View CV
                    <IonIcon icon={openOutline} slot="end" />
                  </IonButton>
                ) : null}
              </IonCardContent>
            </IonCard>

            {application.cover_letter ? (
              <IonCard style={{ margin: '8px 12px 0', borderRadius: 14 }}>
                <IonCardContent>
                  <h4 style={{ margin: '0 0 6px', fontWeight: 700 }}>Cover Letter</h4>
                  <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.875rem' }}>
                    {application.cover_letter}
                  </p>
                </IonCardContent>
              </IonCard>
            ) : null}

            {/* Update Status */}
            <div style={{ padding: '12px 12px 0' }}>
              <h4 style={{ margin: '0 0 8px', fontWeight: 700 }}>Update Application</h4>

              <FormErrors errors={errors} />

              <IonItem style={{ '--border-radius': '12px', marginBottom: 8 }}>
                <IonLabel>Status</IonLabel>
                <IonSelect
                  value={status}
                  onIonChange={(e) => setStatus(e.detail.value)}
                >
                  {STATUSES.map((s) => (
                    <IonSelectOption key={s.value} value={s.value}>{s.label}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem style={{ '--border-radius': '12px' }}>
                <IonLabel position="stacked">Internal Notes</IonLabel>
                <IonTextarea
                  value={notes}
                  onIonInput={(e) => setNotes(e.detail.value ?? '')}
                  placeholder="Add private notes about this applicant..."
                  rows={3}
                  autoGrow
                />
              </IonItem>
            </div>
          </>
        ) : null}

        <IonToast
          isOpen={!!toast}
          message={toast ?? ''}
          duration={2500}
          color={toast === 'Application updated.' ? 'success' : 'danger'}
          onDidDismiss={() => setToast(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CompanyApplicationDetailPage;
