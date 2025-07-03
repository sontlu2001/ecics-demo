'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import WarningTriangle from '@/assets/icons/warning_triangle.svg';

const WarningTriangleIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={WarningTriangle} {...props} />;
};

export default WarningTriangleIcon;
