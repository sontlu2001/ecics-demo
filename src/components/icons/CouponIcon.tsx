'use client';

import CouponIconSvg from '@/assets/icons/coupon.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const CouponIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CouponIconSvg} {...props} />;
};

export default CouponIcon;
