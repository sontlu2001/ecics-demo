'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import NewOldReplacementIconSvg from '@/assets/icons/add-on/new-old-replacement.svg';

const NewOldReplacementIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={NewOldReplacementIconSvg} {...props} />;
};

export default NewOldReplacementIcon;
