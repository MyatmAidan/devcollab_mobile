import { IonAvatar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getAvatarUrl } from '../utils/avatar';

interface AvatarProps {
  name?: string | null;
  profilePhoto?: string | null;
  userAvatar?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  slot?: string;
}

const sizeMap = {
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg',
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  profilePhoto,
  userAvatar,
  size = 'md',
  className = '',
  slot,
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [profilePhoto, userAvatar, name]);

  const src = failed
    ? getAvatarUrl(name)
    : getAvatarUrl(name, profilePhoto, userAvatar);

  return (
    <IonAvatar slot={slot} className={`${sizeMap[size]} ${className}`.trim()}>
      <img
        src={src}
        alt={name ?? 'User'}
        onError={() => setFailed(true)}
      />
    </IonAvatar>
  );
};

export default Avatar;
