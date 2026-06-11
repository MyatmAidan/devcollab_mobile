import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonRange,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useCallback, useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';

interface ProfilePhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (crop: Area) => void;
}

const ProfilePhotoCropModal: React.FC<ProfilePhotoCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onConfirm,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  const handleConfirm = () => {
    if (croppedArea) {
      onConfirm(croppedArea);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crop Photo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="profile-crop-modal">
        {imageSrc ? (
          <div className="profile-crop-stage">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        ) : null}
        <div className="profile-crop-controls ion-padding">
          <label className="profile-crop-zoom-label">Zoom</label>
          <IonRange
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onIonInput={(e) => setZoom(e.detail.value as number)}
          />
          <div className="profile-crop-actions">
            <IonButton fill="outline" type="button" onClick={onClose}>
              Cancel
            </IonButton>
            <IonButton type="button" onClick={handleConfirm} disabled={!croppedArea}>
              Use Photo
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ProfilePhotoCropModal;
