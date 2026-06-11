import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSkeletonText,
} from '@ionic/react';
import {
  briefcaseOutline,
  cloudOutline,
  codeSlashOutline,
  desktopOutline,
  layersOutline,
  phonePortraitOutline,
  serverOutline,
  shieldOutline,
  sparklesOutline,
} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCategories } from '../../api/developerApi';
import type { SkillCategory } from '../../types/developer';

const CATEGORY_ICON: Record<string, string> = {
  frontend: desktopOutline,
  backend: serverOutline,
  mobile: phonePortraitOutline,
  'full-stack': layersOutline,
  fullstack: layersOutline,
  devops: cloudOutline,
  security: shieldOutline,
  'ui-ux': sparklesOutline,
};

const CATEGORY_GRADIENT: Record<string, [string, string]> = {
  frontend:   ['#6366f1', '#818cf8'],
  backend:    ['#0ea5e9', '#38bdf8'],
  mobile:     ['#10b981', '#34d399'],
  'full-stack': ['#f59e0b', '#fbbf24'],
  fullstack:  ['#f59e0b', '#fbbf24'],
  devops:     ['#8b5cf6', '#a78bfa'],
  security:   ['#ef4444', '#f87171'],
  'ui-ux':    ['#ec4899', '#f472b6'],
};

function getCategoryIcon(slug: string): string {
  return CATEGORY_ICON[slug] ?? codeSlashOutline;
}

function getCategoryGradient(slug: string): [string, string] {
  return CATEGORY_GRADIENT[slug] ?? ['#64748b', '#94a3b8'];
}

const JobCategorySelectPage: React.FC = () => {
  const history = useHistory();
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (categoryId: string) => {
    history.push(`/jobs/level/${categoryId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Find Jobs</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            size="small"
            onClick={() => history.push('/jobs/applications/me')}
          >
            My Applications
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '24px 16px 16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--ion-color-medium)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Step 1 of 2
          </p>
          <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: 'var(--ion-color-dark)' }}>
            What role are you looking for?
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--ion-color-medium)' }}>
            Pick a specialization to get started
          </p>

          {/* Browse All */}
          <div
            onClick={() => history.push('/jobs/level/all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 12,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IonIcon icon={briefcaseOutline} style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Browse All Jobs</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>See every open position</div>
            </div>
            <IonIcon
              icon="chevron-forward-outline"
              style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: 18 }}
            />
          </div>

          {/* Category grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{
                    borderRadius: 16, padding: '20px 16px',
                    background: 'var(--ion-color-light)',
                    minHeight: 110,
                  }}>
                    <IonSkeletonText animated style={{ width: '60%', height: 16, borderRadius: 8, marginBottom: 8 }} />
                    <IonSkeletonText animated style={{ width: '40%', height: 12, borderRadius: 8 }} />
                  </div>
                ))
              : categories.map((cat) => {
                  const [from, to] = getCategoryGradient(cat.slug);
                  const icon = getCategoryIcon(cat.slug);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleSelect(cat.id)}
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                        borderRadius: 16,
                        padding: '20px 16px',
                        cursor: 'pointer',
                        boxShadow: `0 4px 14px ${from}55`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        minHeight: 110,
                        justifyContent: 'space-between',
                      }}
                    >
                      <IonIcon icon={icon} style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.3 }}>
                          {cat.name_en}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JobCategorySelectPage;
