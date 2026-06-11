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
  IonLabel,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { briefcaseOutline, cashOutline, locationOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getJobs } from '../../api/jobApi';
import { getCategories } from '../../api/developerApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { JobPosting } from '../../types/job';

const LEVEL_COLOR: Record<string, string> = {
  junior: 'success',
  mid: 'primary',
  senior: 'warning',
  lead: 'danger',
};

const LEVEL_LABEL: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  lead: 'Lead',
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

interface RouteParams {
  categoryId?: string;
  level?: string;
}

const JobsListPage: React.FC = () => {
  const { categoryId, level } = useParams<RouteParams>();
  const history = useHistory();

  const hasFilters = !!categoryId;
  const activeCategoryId = categoryId && categoryId !== 'all' ? categoryId : undefined;
  const activeLevel = level && level !== 'all' ? level : undefined;

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    if (!activeCategoryId) return;
    getCategories()
      .then((cats) => {
        const match = cats.find((c) => c.id === activeCategoryId);
        if (match) setCategoryName(match.name_en);
      })
      .catch(() => {});
  }, [activeCategoryId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getJobs({
          search: search || undefined,
          category_id: activeCategoryId,
          experience_level: activeLevel,
          per_page: 30,
        });
        setJobs(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [search, activeCategoryId, activeLevel]);

  const filterLabel = [
    categoryName || (activeCategoryId ? 'Category' : null),
    activeLevel ? (LEVEL_LABEL[activeLevel] ?? activeLevel) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {hasFilters ? (
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/jobs" />
            </IonButtons>
          ) : null}
          <IonTitle>{filterLabel || 'Find Jobs'}</IonTitle>
          <IonButtons slot="end">
            {hasFilters ? (
              <IonButton fill="clear" size="small" onClick={() => history.push('/tabs/jobs')}>
                Change
              </IonButton>
            ) : null}
            <IonButton fill="clear" size="small" onClick={() => history.push('/jobs/applications/me')}>
              My Apps
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value ?? '')}
            debounce={400}
            placeholder="Search jobs, skills, location..."
          />
        </IonToolbar>

        {/* Active filter chips */}
        {(activeCategoryId || activeLevel) ? (
          <IonToolbar style={{ '--min-height': '40px' } as React.CSSProperties}>
            <div style={{ display: 'flex', gap: 8, padding: '0 12px', overflowX: 'auto' }}>
              {categoryName ? (
                <IonChip color="secondary" style={{ margin: 0, height: 28, fontSize: 12 }}>
                  <IonLabel>{categoryName}</IonLabel>
                </IonChip>
              ) : null}
              {activeLevel ? (
                <IonChip color={LEVEL_COLOR[activeLevel] ?? 'medium'} style={{ margin: 0, height: 28, fontSize: 12 }}>
                  <IonLabel style={{ textTransform: 'capitalize' }}>{LEVEL_LABEL[activeLevel] ?? activeLevel}</IonLabel>
                </IonChip>
              ) : null}
            </div>
          </IonToolbar>
        ) : null}
      </IonHeader>

      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {error ? (
          <p className="ion-padding" style={{ color: 'var(--ion-color-danger)' }}>{error}</p>
        ) : null}

        {!loading && jobs.length === 0 ? (
          <div className="ion-padding ion-text-center" style={{ marginTop: 60 }}>
            <IonIcon icon={briefcaseOutline} style={{ fontSize: 52, color: 'var(--ion-color-medium)' }} />
            <p style={{ color: 'var(--ion-color-medium)', marginTop: 12 }}>No jobs found</p>
            {hasFilters ? (
              <IonButton fill="outline" size="small" onClick={() => history.push('/tabs/jobs')} style={{ marginTop: 8 }}>
                Change Filters
              </IonButton>
            ) : null}
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
                        <IonBadge
                          color={LEVEL_COLOR[job.experience_level] ?? 'medium'}
                          style={{ textTransform: 'capitalize', borderRadius: 6, padding: '4px 8px' }}
                        >
                          {LEVEL_LABEL[job.experience_level] ?? job.experience_level}
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
