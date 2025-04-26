'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import KeyIconSvg from '@/assets/icons/add-on/key.svg';

const KeyIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={KeyIconSvg} {...props} />;
};

export default KeyIcon;
