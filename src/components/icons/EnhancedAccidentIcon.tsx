'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import EnhancedAccidentIconSvg from '@/assets/icons/add-on/enhanced-accident.svg';

const EnhancedAccidentIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={EnhancedAccidentIconSvg} {...props} />;
};

export default EnhancedAccidentIcon;
