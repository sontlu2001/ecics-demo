import { Select, SelectProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

interface DropdownFieldProps extends SelectProps {
  name: string;
  options: DropdownOption[];
  label?: string;
}
export interface DropdownOption {
  value: string | number;
  text: string;
}

export const DropdownField = ({
  name,
  label,
  options,
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
            <span className='text-base font-semibold'>{label}</span>
            <Select
              {...props}
              {...field}
              optionFilterProp='children'
              status={fieldState.invalid ? 'error' : ''}
              className={`w-full ${fieldState.invalid ? '!border-red-500' : ''}`}
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
