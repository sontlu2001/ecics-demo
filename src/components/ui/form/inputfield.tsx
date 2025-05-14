import { Input, InputProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

interface InputFieldProps extends InputProps {
  name: string;
  label?: string;
}

export const InputField = ({ name, label, ...props }: InputFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <span className='text-base font-semibold'>{label}</span>
            <Input
              {...props}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              status={fieldState.invalid ? 'error' : undefined}
              className={`w-full ${fieldState.invalid ? '!border-red-500' : ''} ${
                props.disabled ? 'bg-gray-200' : ''
              }`}
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
