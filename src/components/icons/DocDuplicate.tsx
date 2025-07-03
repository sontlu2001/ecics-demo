'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import DocDuplicateIconSvg from '@/assets/icons/document-duplicate.svg';

const DocDuplicate = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={DocDuplicateIconSvg} {...props} />;
};

export default DocDuplicate;
