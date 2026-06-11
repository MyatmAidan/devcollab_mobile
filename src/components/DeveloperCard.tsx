import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
} from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import type { DeveloperProfile } from '../types/developer';
import { hapticLight } from '../utils/haptics';
import Avatar from './Avatar';
import ConnectAction from './ConnectAction';

interface DeveloperCardProps {
  developer: DeveloperProfile;
  onStatusChange?: () => void;
  index?: number;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onStatusChange, index = 0 }) => {
  const history = useHistory();
  const displayName = developer.user?.name ?? 'Developer';

  const handleViewProfile = () => {
    void hapticLight();
    history.push(`/developers/${developer.id}`);
  };

  return (
    <IonCard className="developer-card" style={{ animationDelay: `${index * 60}ms` }}>
      <IonCardContent>
        <div className="developer-card-top">
          <div className="avatar-ring">
            <Avatar
              name={displayName}
              profilePhoto={developer.profile_photo}
              userAvatar={developer.user?.avatar}
              size="lg"
            />
          </div>
          <div className="developer-card-info">
            <h2>{displayName}</h2>
            <p className="role-text">
              {developer.role_title || 'Developer'}
              {developer.experience_level ? ` · ${developer.experience_level}` : ''}
            </p>
            {developer.headline ? <p className="headline-text">{developer.headline}</p> : null}
          </div>
        </div>
        {developer.location ? (
          <p className="meta-text">
            <IonIcon icon={locationOutline} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {developer.location}
          </p>
        ) : null}
        <div className="skill-row">
          {(developer.skills ?? []).slice(0, 4).map((skill) => (
            <IonChip key={skill.id} outline color="primary">
              {skill.name}
            </IonChip>
          ))}
        </div>
        <div className="card-actions">
          <IonButton fill="outline" size="small" onClick={handleViewProfile}>
            View Profile
          </IonButton>
          <ConnectAction
            userId={developer.user_id}
            status={developer.connection_status}
            connectionRequestId={developer.connection_request_id}
            conversationId={developer.conversation_id}
            onStatusChange={onStatusChange}
          />
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default DeveloperCard;
