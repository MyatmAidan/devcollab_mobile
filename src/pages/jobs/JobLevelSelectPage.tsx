import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  appsOutline,
  flashOutline,
  leafOutline,
  ribbonOutline,
  rocketOutline,
  starOutline,
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getCategories } from '../../api/developerApi';
import type { SkillCategory } from '../../types/developer';

interface LevelOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  gradient: [string, string];
}

const LEVELS: LevelOption[] = [
  {
    value: 'all',
    label: 'All Levels',
    description: 'See jobs for every experience',
    icon: appsOutline,
    color: '#475569',
    gradient: ['#1e293b', '#334155'],
  },
  {
    value: 'junior',
    label: 'Junior',
    description: '0–2 years, learning & growing',
    icon: leafOutline,
    color: '#059669',
    gradient: ['#059669', '#34d399'],
  },
  {
    value: 'mid',
    label: 'Mid-level',
    description: '2–5 years, solid foundations',
    icon: rocketOutline,
    color: '#2563eb',
    gradient: ['#2563eb', '#60a5fa'],
  },
  {
    value: 'senior',
    label: 'Senior',
    description: '5+ years, leading solutions',
    icon: starOutline,
    color: '#d97706',
    gradient: ['#d97706', '#fbbf24'],
  },
  {
    value: 'lead',
    label: 'Lead',
    description: 'Tech lead & architecture',
    icon: ribbonOutline,
    color: '#dc2626',
    gradient: ['#dc2626', '#f87171'],
  },
];

const JobLevelSelectPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const history = useHistory();
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    if (categoryId === 'all') return;
    getCategories()
      .then((cats: SkillCategory[]) => {
        const match = cats.find((c) => c.id === categoryId);
        if (match) setCategoryName(match.name_en);
      })
      .catch(() => {});
  }, [categoryId]);

  const handleSelect = (level: string) => {
    history.push(`/jobs/results/${categoryId}/${level}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/jobs" />
          </IonButtons>
          <IonTitle>{categoryName || 'All Jobs'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '24px 16px 32px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--ion-color-medium)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Step 2 of 2
          </p>
          <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: 'var(--ion-color-dark)' }}>
            What's your experience level?
          </h2>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--ion-color-medium)' }}>
            {categoryName ? `Showing ${categoryName} jobs for…` : 'Showing jobs for…'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LEVELS.map((level) => (
              <div
                key={level.value}
                onClick={() => handleSelect(level.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: `linear-gradient(135deg, ${level.gradient[0]}, ${level.gradient[1]})`,
                  borderRadius: 18,
                  padding: '18px 20px',
                  cursor: 'pointer',
                  boxShadow: `0 4px 16px ${level.gradient[0]}44`,
                }}
              >
                {/* Icon bubble */}
                <div style={{
                  width: 52, height: 52, borderRadius: 15,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IonIcon icon={level.icon} style={{ fontSize: 26, color: '#fff' }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 2 }}>
                    {level.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    {level.description}
                  </div>
                </div>

                {/* Arrow */}
                <IonIcon
                  icon={flashOutline}
                  style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}
                />
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JobLevelSelectPage;
