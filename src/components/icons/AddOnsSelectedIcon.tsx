'use client';

import AddOnsSelectedIconSvg from '@/assets/icons/review/add-ons-selected.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const AddOnsSelectedIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={AddOnsSelectedIconSvg} {...props} />;
};

export default AddOnsSelectedIcon;
