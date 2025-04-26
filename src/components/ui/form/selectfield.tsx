import { Select, SelectProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

interface SelectFieldProps extends SelectProps {
  name: string;
  label?: string;
}

export const SelectField = ({ name, label, ...props }: SelectFieldProps) => {
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
              status={fieldState.invalid ? 'error' : undefined}
              className={`w-full ${fieldState.invalid ? '!border-red-500' : ''}`}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              value={field.value}
            />
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
