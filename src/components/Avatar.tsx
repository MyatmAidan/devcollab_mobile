import { IonAvatar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getAvatarUrl } from '../utils/avatar';

interface AvatarProps {
  name?: string | null;
  profilePhoto?: string | null;
  userAvatar?: string | null;
  /** Explicit real-time presence override. Takes priority over lastActiveAt. */
  isOnline?: boolean;
  /** Fallback: derive online status from last_active_at timestamp. */
  lastActiveAt?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  slot?: string;
}

const sizeMap = {
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg',
};

const dotSize = { sm: 10, md: 13, lg: 16 };
const dotOffset = { sm: 0, md: 1, lg: 2 };

export function isOnline(lastActiveAt: string | null | undefined): boolean {
  if (!lastActiveAt) return false;
  return (Date.now() - new Date(lastActiveAt).getTime()) < 5 * 60 * 1000; // 5 min
}

export function lastSeenLabel(lastActiveAt: string | null | undefined): string {
  if (!lastActiveAt) return 'Offline';
  const diff = Math.floor((Date.now() - new Date(lastActiveAt).getTime()) / 1000);
  if (diff < 300) return 'Online';
  if (diff < 3600) return `Active ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `Active ${Math.floor(diff / 3600)}h ago`;
  return `Active ${Math.floor(diff / 86400)}d ago`;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  profilePhoto,
  userAvatar,
  isOnline: isOnlineProp,
  lastActiveAt,
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

  // isOnlineProp wins; fall back to timestamp-based check
  const online = isOnlineProp !== undefined ? isOnlineProp : isOnline(lastActiveAt);
  const showDot = isOnlineProp !== undefined || lastActiveAt !== undefined;
  const ds = dotSize[size];
  const offset = dotOffset[size];

  return (
    <div
      slot={slot}
      style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}
    >
      <IonAvatar className={`${sizeMap[size]} ${className}`.trim()}>
        <img
          src={src}
          alt={name ?? 'User'}
          onError={() => setFailed(true)}
        />
      </IonAvatar>
      {showDot ? (
        <span
          style={{
            position: 'absolute',
            bottom: offset,
            right: offset,
            width: ds,
            height: ds,
            borderRadius: '50%',
            background: online ? '#22c55e' : '#9ca3af',
            border: '2px solid var(--ion-background-color, #fff)',
            zIndex: 1,
            transition: 'background 0.4s ease',
          }}
        />
      ) : null}
    </div>
  );
};

export default Avatar;
