import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCompanyJobs, deleteCompanyJob } from '../../api/companyApi';
import { getErrorMessage } from '../../api/axios';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';
import type { CompanyJob } from '../../types/company';

const statusColor: Record<string, string> = {
  published: 'success',
  draft: 'medium',
  closed: 'danger',
};

const CompanyJobsPage: React.FC = () => {
  const history = useHistory();
  const { logout, company } = useCompanyAuth();
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompanyJobs();
      setJobs(data);
    } catch (err) {
      setToast(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCompanyJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setToast(getErrorMessage(err));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Jobs</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => void logout()}>
              Sign Out
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(e) => load().then(() => e.detail.complete())}>
          <IonRefresherContent />
        </IonRefresher>

        {company ? (
          <div style={{ padding: '12px 16px 4px', color: 'var(--dc-text-muted)', fontSize: '0.85rem' }}>
            {company.company_name}
          </div>
        ) : null}

        {loading ? <LoadingSpinner /> : null}

        {!loading && jobs.length === 0 ? (
          <EmptyState
            title="No jobs posted"
            description="Tap + to create your first job posting."
          />
        ) : null}

        <div style={{ padding: '0 12px 80px' }}>
          {jobs.map((job) => (
            <IonCard
              key={job.id}
              button
              onClick={() => history.push(`/company/jobs/${job.id}`)}
              style={{ marginBottom: 12, borderRadius: 14 }}
            >
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, margin: '0 0 4px', fontSize: '1rem' }}>
                      {job.title}
                    </h3>
                    {job.category ? (
                      <span style={{
                        fontSize: '0.78rem', color: '#8b5cf6', fontWeight: 600,
                        background: '#ede9fe', padding: '2px 8px', borderRadius: 99,
                        display: 'inline-block', marginBottom: 4,
                      }}>
                        {job.category.name_en}
                      </span>
                    ) : null}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                      <IonBadge color={statusColor[job.status] ?? 'medium'}>
                        {job.status}
                      </IonBadge>
                      {job.experience_level ? (
                        <IonBadge color="primary">{job.experience_level}</IonBadge>
                      ) : null}
                      {job.location ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--dc-text-muted)' }}>
                          {job.location}
                        </span>
                      ) : null}
                    </div>
                    {typeof job.applications_count === 'number' ? (
                      <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--dc-text-muted)' }}>
                        {job.applications_count} applicant{job.applications_count !== 1 ? 's' : ''}
                      </p>
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                    <IonButton
                      fill="clear"
                      size="small"
                      onClick={(e) => { e.stopPropagation(); history.push(`/company/jobs/${job.id}/edit`); }}
                    >
                      <IonIcon icon={createOutline} />
                    </IonButton>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="danger"
                      onClick={(e) => { e.stopPropagation(); void handleDelete(job.id); }}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/company/jobs/create')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonToast isOpen={!!toast} message={toast ?? ''} duration={3000} color="danger" onDidDismiss={() => setToast(null)} />
      </IonContent>
    </IonPage>
  );
};

export default CompanyJobsPage;
