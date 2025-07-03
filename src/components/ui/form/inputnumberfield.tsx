import { InputNumber, InputNumberProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

interface InputNumberFieldProps extends InputNumberProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

export const InputNumberField = ({
  name,
  label,
  isRequired,
  ...props
}: InputNumberFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <span className='text-base font-semibold'>
              {label && (
                <label className='text-base font-semibold'>
                  {label}
                  {isRequired && <span className='text-red-500'>*</span>}
                </label>
              )}
            </span>
            <InputNumber
              {...props}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              status={fieldState.invalid ? 'error' : undefined}
              className={`flex h-10 w-full items-center ${fieldState.invalid ? '!border-red-500' : ''} ${
                props.disabled ? 'bg-gray-200' : ''
              }`}
              type='number'
              inputMode='numeric'
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
