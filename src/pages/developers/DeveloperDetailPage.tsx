import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getDeveloper } from '../../api/developerApi';
import AnimatedEntrance from '../../components/AnimatedEntrance';
import Avatar from '../../components/Avatar';
import ConnectAction from '../../components/ConnectAction';
import LoadingSpinner from '../../components/LoadingSpinner';
import ReportUserModal from '../../components/ReportUserModal';
import SkillBadge from '../../components/SkillBadge';
import type { DeveloperProfile } from '../../types/developer';

const DeveloperDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [developer, setDeveloper] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeveloper(id);
      setDeveloper(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/discover" />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? <LoadingSpinner /> : null}
        {developer ? (
          <AnimatedEntrance>
            <div className="profile-detail profile-detail-page">
              <div className="profile-detail-cover" />
              <div className="profile-detail-body">
                <div className="profile-avatar-wrap avatar-ring">
                  <Avatar
                    name={developer.user?.name}
                    profilePhoto={developer.profile_photo}
                    userAvatar={developer.user?.avatar}
                    size="lg"
                  />
                </div>
                <h2 className="profile-name">{developer.user?.name ?? 'Developer'}</h2>
                <p className="profile-role">{developer.role_title || 'Developer'}</p>
                {developer.headline ? (
                  <div className="profile-section">
                    <h3>Headline</h3>
                    <p>{developer.headline}</p>
                  </div>
                ) : null}
                {developer.bio ? (
                  <div className="profile-section">
                    <h3>About</h3>
                    <p>{developer.bio}</p>
                  </div>
                ) : null}
                {developer.experience_level ? (
                  <div className="profile-section">
                    <h3>Experience</h3>
                    <p style={{ textTransform: 'capitalize' }}>{developer.experience_level}</p>
                  </div>
                ) : null}
                {developer.location ? (
                  <div className="profile-section">
                    <h3>Location</h3>
                    <p>{developer.location}</p>
                  </div>
                ) : null}
                <div className="profile-section">
                  <h3>Skills</h3>
                  <div className="skill-row">
                    {(developer.skills ?? []).map((skill) => (
                      <SkillBadge key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
                <section className="link-list">
                  {developer.github_url ? (
                    <a href={developer.github_url} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                  {developer.linkedin_url ? (
                    <a href={developer.linkedin_url} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  ) : null}
                  {developer.portfolio_url ? (
                    <a href={developer.portfolio_url} target="_blank" rel="noreferrer">
                      Portfolio
                    </a>
                  ) : null}
                </section>
                <ConnectAction
                  userId={developer.user_id}
                  status={developer.connection_status}
                  connectionRequestId={developer.connection_request_id}
                  conversationId={developer.conversation_id}
                  onStatusChange={load}
                  expand
                />
                {developer.connection_status !== 'self' ? (
                  <IonButton
                    expand="block"
                    fill="clear"
                    color="medium"
                    className="ion-margin-top"
                    onClick={() => setReportOpen(true)}
                  >
                    Report user
                  </IonButton>
                ) : null}
              </div>
            </div>
          </AnimatedEntrance>
        ) : null}
        {developer && developer.connection_status !== 'self' ? (
          <ReportUserModal
            isOpen={reportOpen}
            reportedUserId={developer.user_id}
            reportedUserName={developer.user?.name ?? 'this user'}
            onClose={() => setReportOpen(false)}
            onSuccess={() => setSuccess('Report submitted. Our team will review it.')}
          />
        ) : null}
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
        <IonToast isOpen={!!success} message={success ?? ''} duration={3000} color="success" onDidDismiss={() => setSuccess(null)} />
      </IonContent>
    </IonPage>
  );
};

export default DeveloperDetailPage;
