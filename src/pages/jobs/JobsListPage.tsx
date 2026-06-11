import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { briefcaseOutline, locationOutline, cashOutline, ribbonOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getJobs } from '../../api/jobApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { JobPosting } from '../../types/job';

const LEVEL_COLOR: Record<string, string> = {
  junior: 'success',
  mid: 'primary',
  senior: 'warning',
  lead: 'danger',
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

function formatSalary(job: JobPosting): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const currency = job.salary_currency ?? 'USD';
  if (job.salary_min && job.salary_max) {
    return `${currency} ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`;
  }
  if (job.salary_min) return `${currency} ${job.salary_min.toLocaleString()}+`;
  return `Up to ${currency} ${job.salary_max?.toLocaleString()}`;
}

const JobsListPage: React.FC = () => {
  const history = useHistory();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getJobs({ search: search || undefined, per_page: 20 });
        setJobs(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [search]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Find Jobs</IonTitle>
          <IonButton slot="end" fill="clear" size="small" onClick={() => history.push('/jobs/applications/me')}>
            My Applications
          </IonButton>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value ?? '')}
            debounce={400}
            placeholder="Search jobs, skills, location..."
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="ion-padding" style={{ color: 'var(--ion-color-danger)' }}>{error}</p> : null}

        {!loading && jobs.length === 0 ? (
          <div className="ion-padding ion-text-center" style={{ marginTop: 40 }}>
            <IonIcon icon={briefcaseOutline} style={{ fontSize: 48, color: 'var(--ion-color-medium)' }} />
            <p style={{ color: 'var(--ion-color-medium)' }}>No jobs found</p>
          </div>
        ) : null}

        {!loading
          ? jobs.map((job) => {
              const salary = formatSalary(job);
              return (
                <IonCard
                  key={job.id}
                  button
                  onClick={() => history.push(`/jobs/${job.id}`)}
                  style={{ margin: '12px 16px', borderRadius: 12 }}
                >
                  <IonCardContent>
                    {/* Category + Level row */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {job.category ? (
                        <IonChip color="tertiary" style={{ margin: 0, height: 24, fontSize: 12 }}>
                          {job.category.name_en}
                        </IonChip>
                      ) : null}
                      {job.experience_level ? (
                        <IonBadge color={LEVEL_COLOR[job.experience_level] ?? 'medium'} style={{ textTransform: 'capitalize', borderRadius: 6, padding: '4px 8px' }}>
                          {job.experience_level}
                        </IonBadge>
                      ) : null}
                    </div>

                    {/* Title */}
                    <h2 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 17, color: 'var(--ion-color-dark)' }}>
                      {job.title}
                    </h2>

                    {/* Company */}
                    <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--ion-color-medium)' }}>
                      {job.company_profile?.company_name ?? 'Company'}
                      {job.company_profile?.industry ? ` · ${job.company_profile.industry}` : ''}
                    </p>

                    {/* Meta row */}
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13, color: 'var(--ion-color-medium-shade)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <IonIcon icon={locationOutline} style={{ fontSize: 14 }} />
                        {job.location ?? 'Remote'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <IonIcon icon={briefcaseOutline} style={{ fontSize: 14 }} />
                        {EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}
                      </span>
                      {salary ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ion-color-success-shade)' }}>
                          <IonIcon icon={cashOutline} style={{ fontSize: 14 }} />
                          {salary}
                        </span>
                      ) : null}
                    </div>
                  </IonCardContent>
                </IonCard>
              );
            })
          : null}
      </IonContent>
    </IonPage>
  );
};

export default JobsListPage;
