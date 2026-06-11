import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';
import { documentTextOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getCompanyJob, getJobApplications } from '../../api/companyApi';
import { getErrorMessage } from '../../api/axios';
import Avatar from '../../components/Avatar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import type { CompanyJob, JobApplicant } from '../../types/company';

const statusColor: Record<string, string> = {
  pending: 'warning',
  reviewing: 'primary',
  accepted: 'success',
  rejected: 'danger',
};

const CompanyJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [job, setJob] = useState<CompanyJob | null>(null);
  const [applications, setApplications] = useState<JobApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [jobData, appsData] = await Promise.all([
        getCompanyJob(id),
        getJobApplications(id),
      ]);
      setJob(jobData);
      setApplications(appsData);
    } catch (err) {
      setToast(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/company/tabs/jobs" />
          </IonButtons>
          <IonTitle>{job?.title ?? 'Job Detail'}</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => history.push(`/company/jobs/${id}/edit`)}>
              Edit
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(e) => load().then(() => e.detail.complete())}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? <LoadingSpinner /> : null}

        {job && !loading ? (
          <IonCard style={{ margin: '12px 12px 0', borderRadius: 14 }}>
            <IonCardContent>
              <h2 style={{ fontWeight: 700, margin: '0 0 8px' }}>{job.title}</h2>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {job.category ? (
                  <IonChip color="secondary" style={{ fontSize: '0.78rem' }}>
                    {job.category.name_en}
                  </IonChip>
                ) : null}
                {job.experience_level ? (
                  <IonBadge color="primary">{job.experience_level}</IonBadge>
                ) : null}
                <IonBadge color={job.status === 'published' ? 'success' : job.status === 'closed' ? 'danger' : 'medium'}>
                  {job.status}
                </IonBadge>
              </div>
              {job.location ? (
                <p style={{ margin: '4px 0', color: 'var(--dc-text-muted)', fontSize: '0.85rem' }}>
                  {job.location}
                </p>
              ) : null}
              {job.salary_range ? (
                <p style={{ margin: '4px 0', fontWeight: 600, fontSize: '0.9rem' }}>
                  {job.salary_range}
                </p>
              ) : null}
              <p style={{ marginTop: 8, lineHeight: 1.6, fontSize: '0.875rem' }}>{job.description}</p>
            </IonCardContent>
          </IonCard>
        ) : null}

        {!loading ? (
          <div style={{ padding: '16px 12px 4px' }}>
            <h3 style={{ margin: '0 0 8px', fontWeight: 700 }}>
              Applicants ({applications.length})
            </h3>
            {applications.length === 0 ? (
              <EmptyState
                title="No applications yet"
                description="Applicants will appear here."
              />
            ) : null}
            {applications.map((app) => {
              const dev = app.developer_profile;
              const user = dev?.user;
              return (
                <IonItem
                  key={app.id}
                  button
                  detail
                  onClick={() => history.push(`/company/applications/${app.id}`)}
                  style={{ '--border-radius': '12px', marginBottom: 6 }}
                >
                  <Avatar
                    name={user?.name}
                    userAvatar={user?.avatar}
                    size="sm"
                    slot="start"
                  />
                  <IonLabel>
                    <h3>{user?.name ?? 'Applicant'}</h3>
                    <p>
                      {dev?.category?.name_en ?? ''}
                      {dev?.experience_level ? ` · ${dev.experience_level}` : ''}
                    </p>
                  </IonLabel>
                  <IonBadge color={statusColor[app.status] ?? 'medium'} slot="end">
                    {app.status}
                  </IonBadge>
                  {dev?.cv_url ? (
                    <IonIcon icon={documentTextOutline} slot="end" color="primary" />
                  ) : null}
                </IonItem>
              );
            })}
          </div>
        ) : null}

        <IonToast isOpen={!!toast} message={toast ?? ''} duration={3000} color="danger" onDidDismiss={() => setToast(null)} />
      </IonContent>
    </IonPage>
  );
};

export default CompanyJobDetailPage;
