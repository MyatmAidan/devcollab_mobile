import { IonButton, IonSpinner, IonText } from '@ionic/react';
import type { Area } from 'react-easy-crop';
import React, { useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/axios';
import { uploadProfilePhoto } from '../api/profileApi';
import { getCroppedImageFile } from '../utils/cropImage';
import Avatar from './Avatar';
import ProfilePhotoCropModal from './ProfilePhotoCropModal';

interface ProfilePhotoInputProps {
  value: string;
  onChange: (url: string) => void;
  name?: string;
}

const ProfilePhotoInput: React.FC<ProfilePhotoInputProps> = ({ value, onChange, name = 'You' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const resetFileInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const uploadedUrl = await uploadProfilePhoto(file);
      onChange(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (err) {
      setPreview(value);
      setError(getErrorMessage(err, 'Failed to upload photo.'));
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      resetFileInput();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      resetFileInput();
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be 10MB or smaller.');
      resetFileInput();
      return;
    }

    setError(null);
    setCropSrc(URL.createObjectURL(file));
    setCropOpen(true);
    resetFileInput();
  };

  const handleCropClose = () => {
    setCropOpen(false);
    if (cropSrc) {
      URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
    }
  };

  const handleCropConfirm = async (crop: Area) => {
    if (!cropSrc) return;

    const source = cropSrc;
    setCropOpen(false);
    setCropSrc(null);

    try {
      const croppedFile = await getCroppedImageFile(source, crop);
      await uploadFile(croppedFile);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to crop photo.'));
    } finally {
      URL.revokeObjectURL(source);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview('');
    setError(null);
    resetFileInput();
  };

  return (
    <>
      <div className="profile-photo-picker">
        <Avatar name={name} profilePhoto={preview} size="lg" />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="profile-photo-file-input"
          onChange={handleFileChange}
        />
        <div className="profile-photo-actions">
          <IonButton
            type="button"
            size="small"
            fill="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : 'Choose Photo'}
          </IonButton>
          {preview ? (
            <IonButton
              type="button"
              size="small"
              fill="clear"
              color="medium"
              disabled={uploading}
              onClick={handleRemove}
            >
              Remove
            </IonButton>
          ) : null}
        </div>
        {uploading ? (
          <div className="profile-photo-uploading">
            <IonSpinner name="crescent" />
          </div>
        ) : null}
        {error ? (
          <IonText color="danger">
            <p className="profile-photo-error">{error}</p>
          </IonText>
        ) : null}
        <IonText color="medium">
          <p className="profile-photo-hint">Choose a photo, crop it, then upload. JPG or PNG up to 10MB.</p>
        </IonText>
      </div>

      <ProfilePhotoCropModal
        isOpen={cropOpen}
        imageSrc={cropSrc}
        onClose={handleCropClose}
        onConfirm={handleCropConfirm}
      />
    </>
  );
};

export default ProfilePhotoInput;
