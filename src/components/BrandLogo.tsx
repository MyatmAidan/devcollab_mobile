import React from 'react';
import { BRAND_ICON_SRC, BRAND_LOGO_SRC } from '../lib/brand';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  alt?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  className,
  alt = 'DevCollab',
}) => (
  <img
    src={variant === 'icon' ? BRAND_ICON_SRC : BRAND_LOGO_SRC}
    alt={alt}
    className={className}
    draggable={false}
  />
);

export default BrandLogo;
