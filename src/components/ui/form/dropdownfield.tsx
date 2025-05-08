import { Select, SelectProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';

interface DropdownFieldProps extends SelectProps {
  name: string;
  options: DropdownOption[];
  label?: string;
  className?: string;
}

export interface DropdownOption {
  value: string | number;
  text: string;
}

export const DropdownField = ({
  name,
  label,
  options,
  disabled,
  className,
  ...props
}: DropdownFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            {label && <span className='text-base font-semibold'>{label}</span>}
            <Select
              {...props}
              {...field}
              value={field.value}
              onChange={(value, option) => {
                field.onChange(value);
                props.onChange?.(value, option);
              }}
              disabled={disabled}
              optionFilterProp='children'
              status={fieldState.invalid ? 'error' : ''}
              className={`w-full ${fieldState.invalid ? '!border-red-500' : ''}`}
              suffixIcon={
                <ArrowDownIcon
                  size={12}
                  className={
                    disabled
                      ? 'text-[rgba(0,0,0,0.25)]'
                      : 'text-[rgba(0,0,0,0.85)]'
                  }
                />
              }
            >
              {options.map((option: DropdownOption) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.text}
                </Select.Option>
              ))}
            </Select>
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
