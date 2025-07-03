import { Radio, RadioProps } from 'antd';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DropdownOption, OptionType } from './dropdownfield';

interface RadioFieldProps extends RadioProps {
  name: string;
  label?: string;
  options: DropdownOption[];
  isRequired?: boolean;
}

export const RadioField = ({
  name,
  label,
  options,
  className,
  isRequired,
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
            <span className='text-base font-semibold'>
              {label}
              {isRequired && (
                <span className='font-semibold text-[#C80F1E]'>*</span>
              )}
            </span>
            <Radio.Group
              {...props}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              className={`grid w-full grid-cols-1 gap-2 xl:flex xl:gap-4 ${className}`}
            >
              {options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  className={`mr-0 flex-grow rounded-lg border py-2 ps-2 text-[13px] transition-colors ${
                    field.value === option.value
                      ? 'border-[#00ADEF]'
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

interface AddOnRadioGroupFieldProps {
  options: OptionType[];
  selectedOption: string;
  handleSelectOption: (value: string) => void;
  isPending: boolean;
}

export const AddOnRadioGroupField = ({
  options,
  selectedOption,
  handleSelectOption,
  isPending,
}: AddOnRadioGroupFieldProps) => {
  return (
    <Radio.Group
      value={selectedOption}
      onChange={(e) => handleSelectOption(e.target.value)}
      disabled={isPending}
      className='flex flex-col gap-2 md:flex-row md:gap-4'
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          className='!text-sm !font-normal'
        >
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};
