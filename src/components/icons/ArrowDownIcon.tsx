'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import ArrowDownIconSvg from '@/assets/icons/review/arrow-down.svg';

const ArrowDownIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  const { className, ...rest } = props;

  return (
    <SvgIcon
      svg={ArrowDownIconSvg}
      className={`arrow-down-icon ${className}`}
      {...rest}
    />
  );
};

export default ArrowDownIcon;
