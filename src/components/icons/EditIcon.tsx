'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import Edit from '@/assets/icons/edit.svg';

const EditIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={Edit} {...props} />;
};

export default EditIcon;
