import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getMyProfile } from '../../api/profileApi';
import AnimatedEntrance from '../../components/AnimatedEntrance';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Avatar from '../../components/Avatar';
import SkillBadge from '../../components/SkillBadge';
import { useAuth } from '../../hooks/useAuth';
import type { DeveloperProfile } from '../../types/developer';

const MyProfilePage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        setProfile(null);
        setError(getErrorMessage(err, 'Unable to load profile.'));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{user?.name?.split(' ')[0] ?? 'Profile'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {!loading && error ? (
          <EmptyState title="No profile yet" description={error} />
        ) : null}
        {!loading && profile ? (
          <AnimatedEntrance>
            <div className="profile-cover" />
            <div className="profile-header-content">
              <div className="profile-avatar-wrap avatar-ring">
                <Avatar
                  name={user?.name}
                  profilePhoto={profile.profile_photo}
                  userAvatar={user?.avatar}
                  size="lg"
                />
              </div>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-role">{profile.category?.name_en ?? 'Developer'}</p>
              <div className="profile-stats">
                <div className="profile-stat">
                  <strong>{(profile.skills ?? []).length}</strong>
                  <span>Skills</span>
                </div>
                <div className="profile-stat">
                  <strong style={{ textTransform: 'capitalize' }}>{profile.experience_level ?? '—'}</strong>
                  <span>Level</span>
                </div>
                <div className="profile-stat">
                  <strong>{profile.location ? '✓' : '—'}</strong>
                  <span>Available</span>
                </div>
              </div>
            </div>
            {profile.headline ? (
              <div className="profile-section" style={{ margin: '0 1.25rem 0.75rem' }}>
                <h3>Headline</h3>
                <p>{profile.headline}</p>
              </div>
            ) : null}
            {profile.bio ? (
              <div className="profile-section" style={{ margin: '0 1.25rem 0.75rem' }}>
                <h3>About</h3>
                <p>{profile.bio}</p>
              </div>
            ) : null}
            {(profile.skills ?? []).length > 0 ? (
              <div className="profile-section" style={{ margin: '0 1.25rem 0.75rem' }}>
                <h3>Skills</h3>
                <div className="skill-row">
                  {(profile.skills ?? []).map((skill) => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            ) : null}
            <div className="profile-actions">
              <IonButton expand="block" onClick={() => history.push('/profile/edit')}>
                Edit Profile
              </IonButton>
            </div>
          </AnimatedEntrance>
        ) : null}
        {!loading && !profile && !error ? (
          <div className="ion-padding">
            <EmptyState
              title="Create your profile"
              description="Set up your developer profile so others can discover you."
            />
            <IonButton expand="block" onClick={() => history.push('/profile/create')}>
              Get Started
            </IonButton>
          </div>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default MyProfilePage;
