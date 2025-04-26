'use client';

import DocDuplicateIconSvg from '@/assets/icons/document-duplicate.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const DocDuplicate = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={DocDuplicateIconSvg} {...props} />;
};

export default DocDuplicate;
