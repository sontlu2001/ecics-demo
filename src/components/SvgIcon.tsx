'use client';

import React, { MouseEventHandler } from 'react';

export type SvgIconProps = {
  svg: React.FC<React.SVGProps<SVGSVGElement>>;
  size?: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

const SvgIcon = ({
  svg: SvgComponent,
  size = 24,
  className = '',
  onClick,
}: SvgIconProps) => {
  return (
    <span
      role='img'
      className={`inline-flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      <SvgComponent width={size} height={size} />
    </span>
  );
};

export default SvgIcon;
