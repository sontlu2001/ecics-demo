import { Radio, RadioProps } from 'antd';
import React from 'react';
import { DropdownOption } from './dropdownfield';
import { Controller, useFormContext } from 'react-hook-form';

interface RadioFieldProps extends RadioProps {
  name: string;
  label?: string;
  options: DropdownOption[];
}

const RadioField = ({
  name,
  label,
  options,
  className,
  ...props
}: RadioFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <span className='text-base font-semibold'>{label}</span>
            <Radio.Group
              {...props}
              {...field}
              className={`flex w-full gap-1 ${className}`}
            >
              {options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  className={`mr-0 w-full rounded-lg border py-2 ps-2 text-[13px] transition-colors ${
                    field.value === option.value
                      ? 'border-blue-400'
                      : 'border-gray-300'
                  }`}
                >
                  {option.text}
                </Radio>
              ))}
            </Radio.Group>
            {fieldState.error && (
              <span className='block text-sm text-red-500'>
                {fieldState.error.message}
              </span>
            )}
          </>
        )}
      />
    </>
  );
};

export default RadioField;
