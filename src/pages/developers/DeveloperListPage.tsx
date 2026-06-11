import {
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/axios';
import { getDevelopers, getSkills } from '../../api/developerApi';
import AnimatedEntrance from '../../components/AnimatedEntrance';
import DeveloperCard from '../../components/DeveloperCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import type { DeveloperProfile, Skill } from '../../types/developer';

const EXPERIENCE_LEVELS = ['junior', 'mid', 'senior', 'lead'];
const ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'mobile', label: 'Mobile' },
];

const DeveloperListPage: React.FC = () => {
  const { user } = useAuth();
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [skill, setSkill] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const loadDevelopers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDevelopers({
        role: role || undefined,
        skill: skill || undefined,
        experience_level: experienceLevel || undefined,
        per_page: 30,
      });
      const filtered = response.data.filter((dev) => {
        if (dev.user_id === user?.id) return false;
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        const name = dev.user?.name?.toLowerCase() ?? '';
        const headline = dev.headline?.toLowerCase() ?? '';
        const roleTitle = dev.role_title?.toLowerCase() ?? '';
        return name.includes(term) || headline.includes(term) || roleTitle.includes(term);
      });
      setDevelopers(filtered);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load developers.'));
    } finally {
      setLoading(false);
    }
  }, [role, skill, experienceLevel, search, user?.id]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch {
        // Skills filter is optional.
      }
    };
    void loadSkills();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDevelopers();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadDevelopers]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Discover</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="discover-content">
        <div className="discover-header">
          <IonInput
            className="discover-search"
            value={search}
            placeholder="Search developers..."
            onIonInput={(e) => setSearch(e.detail.value ?? '')}
          >
            <IonIcon icon={searchOutline} slot="start" color="medium" />
          </IonInput>
          <div className="discover-filters">
            {ROLES.map((r) => (
              <IonChip
                key={r.value || 'all'}
                className={`filter-chip${role === r.value ? ' active' : ''}`}
                onClick={() => setRole(r.value)}
              >
                {r.label}
              </IonChip>
            ))}
            <IonChip
              className={`filter-chip${showFilters ? ' active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              More Filters
            </IonChip>
          </div>
          {showFilters ? (
            <AnimatedEntrance>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <IonSelect
                  value={skill}
                  placeholder="Skill"
                  interface="popover"
                  onIonChange={(e) => setSkill(e.detail.value)}
                  style={{ flex: 1, background: 'var(--dc-feed-bg)', borderRadius: '8px', padding: '0 8px' }}
                >
                  <IonSelectOption value="">Any skill</IonSelectOption>
                  {skills.map((item) => (
                    <IonSelectOption key={item.id} value={item.slug}>
                      {item.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                <IonSelect
                  value={experienceLevel}
                  placeholder="Level"
                  interface="popover"
                  onIonChange={(e) => setExperienceLevel(e.detail.value)}
                  style={{ flex: 1, background: 'var(--dc-feed-bg)', borderRadius: '8px', padding: '0 8px' }}
                >
                  <IonSelectOption value="">Any level</IonSelectOption>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <IonSelectOption key={level} value={level}>
                      {level}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </AnimatedEntrance>
          ) : null}
        </div>

        {loading ? <LoadingSpinner /> : null}
        {!loading && developers.length === 0 ? (
          <EmptyState title="No developers found" description="Try adjusting your filters." />
        ) : null}
        {!loading
          ? developers.map((developer, index) => (
              <AnimatedEntrance key={developer.id} index={index}>
                <DeveloperCard
                  developer={developer}
                  onStatusChange={loadDevelopers}
                  index={index}
                />
              </AnimatedEntrance>
            ))
          : null}

        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default DeveloperListPage;
