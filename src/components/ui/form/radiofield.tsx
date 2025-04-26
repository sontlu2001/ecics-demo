import { Radio, RadioProps } from 'antd';
import React from 'react';
import { DropdownOption } from './dropdownfield';
import { Controller, useFormContext } from 'react-hook-form';

interface RadioFieldProps extends RadioProps {
  name: string;
  label?: string;
  options: DropdownOption[];
}

const RadioField = ({ name, label, options, ...props }: RadioFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <span className='text-base font-semibold'>{label}</span>
            <Radio.Group {...props} {...field} className='w-full'>
              {options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  className={`rounded-lg border p-2 transition-colors ${
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
