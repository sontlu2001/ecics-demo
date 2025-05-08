'use client';

import Edit from '@/assets/icons/edit.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const EditIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={Edit} {...props} />;
};

export default EditIcon;
