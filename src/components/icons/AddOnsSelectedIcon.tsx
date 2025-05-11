'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import AddOnsSelectedIconSvg from '@/assets/icons/review/add-ons-selected.svg';

const AddOnsSelectedIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={AddOnsSelectedIconSvg} {...props} />;
};

export default AddOnsSelectedIcon;
