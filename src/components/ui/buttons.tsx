import React, { forwardRef } from 'react';
import { Button, ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {}

export const PrimaryButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className = '', children, disabled, ...rest }, ref) => {
    const baseStyle = 'px-3 text-base font-semibold hover:opacity-85';

    const enabledStyle = 'bg-[#00adef] text-white';
    const disabledStyle =
      'bg-gray-400 text-white cursor-not-allowed opacity-90';

    return (
      <Button
        type='primary'
        size='large'
        className={`${className} ${baseStyle} ${disabled ? disabledStyle : enabledStyle}`}
        ref={ref}
        disabled={disabled}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

export const SecondaryButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <Button
        type='default'
        size='large'
        name=''
        className={`${className} border-blue-400 px-3 text-base font-semibold text-blue-400 hover:bg-blue-50`}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

export const LinkButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <Button
        type='link'
        size='large'
        className={`${className} text-base font-semibold text-blue-400 underline hover:bg-transparent hover:underline`}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);
