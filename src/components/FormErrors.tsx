import { IonIcon } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import React from 'react';

interface FormErrorsProps {
  errors: string[];
  style?: React.CSSProperties;
}

const FormErrors: React.FC<FormErrorsProps> = ({ errors, style }) => {
  if (errors.length === 0) return null;

  return (
    <div
      style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 10,
        padding: '12px 14px',
        margin: '8px 0',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <IonIcon
          icon={alertCircleOutline}
          style={{ color: '#dc2626', fontSize: 18, flexShrink: 0, marginTop: 1 }}
        />
        <div style={{ flex: 1 }}>
          {errors.length === 1 ? (
            <p style={{ margin: 0, color: '#dc2626', fontSize: 14, lineHeight: 1.4 }}>
              {errors[0]}
            </p>
          ) : (
            <ul style={{ margin: 0, padding: '0 0 0 16px', color: '#dc2626', fontSize: 14, lineHeight: 1.6 }}>
              {errors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormErrors;
