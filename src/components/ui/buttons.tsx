import { Button, ButtonProps } from 'antd';
import React, { forwardRef } from 'react';

interface CustomButtonProps extends ButtonProps {}

export const PrimaryButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    { className = '', children, disabled, htmlType = 'button', ...rest },
    ref,
  ) => {
    const baseStyle = 'px-3 text-base font-bold hover:opacity-85';

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
        htmlType={htmlType}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

export const SecondaryButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, htmlType = 'button', danger, ...rest }, ref) => {
    const baseClass = 'px-3 text-base font-semibold';
    const colorClass = danger
      ? 'text-[#FD1212] border-[#FD1212] hover:bg-red-50'
      : 'text-blue-400 border-blue-400 hover:bg-blue-50';

    return (
      <Button
        type='default'
        size='large'
        className={`${baseClass} ${colorClass} ${className}`}
        ref={ref}
        htmlType={htmlType}
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
        className={`${className} text-blue-400 underline hover:bg-transparent hover:underline`}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);
