import {
  IonBadge,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCompanyJobs, getJobApplications } from '../../api/companyApi';
import { getErrorMessage } from '../../api/axios';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { ApplicationStatus, CompanyJob, JobApplicant } from '../../types/company';

const statusColor: Record<string, string> = {
  pending: 'warning',
  reviewing: 'primary',
  accepted: 'success',
  rejected: 'danger',
};

interface ApplicationWithJob extends JobApplicant {
  jobTitle?: string;
}

const CompanyApplicationsPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const jobs: CompanyJob[] = await getCompanyJobs();
      const allApps: ApplicationWithJob[] = [];
      await Promise.all(
        jobs.map(async (job) => {
          const apps = await getJobApplications(job.id);
          apps.forEach((app) => {
            allApps.push({ ...app, jobTitle: job.title });
          });
        }),
      );
      // Sort newest first
      allApps.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setApplications(allApps);
    } catch (err) {
      setToast(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Applications</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value as ApplicationStatus | 'all')}>
            <IonSegmentButton value="all">All</IonSegmentButton>
            <IonSegmentButton value="pending">Pending</IonSegmentButton>
            <IonSegmentButton value="reviewing">Review</IonSegmentButton>
            <IonSegmentButton value="accepted">Accepted</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(e) => load().then(() => e.detail.complete())}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? <LoadingSpinner /> : null}

        {!loading && filtered.length === 0 ? (
          <EmptyState title="No applications" description="Applications to your job postings appear here." />
        ) : null}

        {filtered.map((app) => {
          const dev = app.developer_profile;
          const user = dev?.user;
          return (
            <IonItem
              key={app.id}
              button
              detail
              onClick={() => history.push(`/company/applications/${app.id}`)}
            >
              <Avatar name={user?.name} userAvatar={user?.avatar} size="sm" slot="start" />
              <IonLabel>
                <h3>{user?.name ?? 'Applicant'}</h3>
                <p style={{ fontSize: '0.78rem' }}>
                  {app.jobTitle ?? ''}
                  {dev?.experience_level ? ` · ${dev.experience_level}` : ''}
                </p>
              </IonLabel>
              <IonBadge color={statusColor[app.status] ?? 'medium'} slot="end">
                {app.status}
              </IonBadge>
            </IonItem>
          );
        })}

        <IonToast isOpen={!!toast} message={toast ?? ''} duration={3000} color="danger" onDidDismiss={() => setToast(null)} />
      </IonContent>
    </IonPage>
  );
};

export default CompanyApplicationsPage;
