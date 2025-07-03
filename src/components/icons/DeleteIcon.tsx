'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import Delete from '@/assets/icons/delete.svg';

const DeleteIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={Delete} {...props} />;
};

export default DeleteIcon;
