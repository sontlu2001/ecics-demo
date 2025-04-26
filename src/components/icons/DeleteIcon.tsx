'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import DeleteIconSvg from '@/assets/icons/add-on/delete.svg';

const DeleteIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={DeleteIconSvg} {...props} />;
};

export default DeleteIcon;
