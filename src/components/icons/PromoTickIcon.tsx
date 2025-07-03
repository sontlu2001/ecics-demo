'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import PromoTickIconSvg from '@/assets/icons/promo-tick.svg';

const PromoTickIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PromoTickIconSvg} {...props} />;
};

export default PromoTickIcon;
