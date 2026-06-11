import type { Area } from 'react-easy-crop';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => reject(new Error('Failed to load image.')));
    image.crossOrigin = 'anonymous';
    image.src = src;
  });
}

export async function getCroppedImageFile(
  imageSrc: string,
  crop: Area,
  fileName = 'profile-photo.jpg',
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not prepare image crop.');
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error('Could not crop image.'));
      },
      'image/jpeg',
      0.92,
    );
  });

  return new File([blob], fileName, { type: 'image/jpeg' });
}
