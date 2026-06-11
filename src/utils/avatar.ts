import { getApiRoot } from '../lib/apiConfig';
import type { DeveloperProfile } from '../types/developer';
import type { User } from '../types/user';

function resolvePhotoUrl(photo?: string | null): string | null {
  if (!photo?.trim()) return null;

  if (photo.startsWith('blob:') || photo.startsWith('data:')) {
    return photo;
  }

  const root = getApiRoot();

  if (photo.startsWith('/storage/')) {
    return `${root}${photo}`;
  }

  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    try {
      const parsed = new URL(photo);
      if (parsed.pathname.startsWith('/storage/')) {
        return `${root}${parsed.pathname}`;
      }
    } catch {
      return photo;
    }
    return photo;
  }

  return `${root}${photo.startsWith('/') ? photo : `/${photo}`}`;
}

export function getAvatarUrl(
  name?: string | null,
  profilePhoto?: string | null,
  userAvatar?: string | null,
): string {
  const photo = resolvePhotoUrl(profilePhoto) || resolvePhotoUrl(userAvatar);
  if (photo) return photo;
  const label = encodeURIComponent(name?.trim() || 'User');
  return `https://ui-avatars.com/api/?name=${label}&background=1877f2&color=fff&size=128`;
}

export function getDeveloperAvatar(developer?: DeveloperProfile | null): string {
  return getAvatarUrl(
    developer?.user?.name,
    developer?.profile_photo,
    developer?.user?.avatar,
  );
}

export function getUserAvatar(user?: User | null, profilePhoto?: string | null): string {
  return getAvatarUrl(user?.name, profilePhoto, user?.avatar);
}
