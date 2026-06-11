import { IonSpinner } from '@ionic/react';
import React from 'react';
import BrandLogo from './BrandLogo';

interface LoadingSpinnerProps {
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading...' }) => (
  <div className="ion-text-center ion-padding loading-spinner" style={{ animation: 'dc-fade-in 0.4s ease-out' }}>
    <BrandLogo variant="icon" className="loading-spinner-icon" alt="" />
    <IonSpinner name="crescent" color="primary" />
    <p style={{ color: 'var(--dc-text-secondary)', fontSize: '0.9rem', marginTop: '0.75rem' }}>{label}</p>
  </div>
);

export default LoadingSpinner;
