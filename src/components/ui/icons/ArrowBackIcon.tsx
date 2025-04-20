'use client';

import ArrowBackIconSvg from '@/assets/icons/arrow_back.svg';
import { SvgIconProps } from "@/components/SvgIcon";

const ArrowBackIcon = (props: Omit<SvgIconProps, 'svg'>) => {
    return <ArrowBackIconSvg {...props} />;
};

export default ArrowBackIcon;
