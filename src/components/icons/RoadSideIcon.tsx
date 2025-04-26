'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import RoadSideIconSvg from '@/assets/icons/add-on/road-side.svg';

const RoadSideIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={RoadSideIconSvg} {...props} />;
};

export default RoadSideIcon;
