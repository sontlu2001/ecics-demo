import { Input, InputProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

interface InputFieldProps extends InputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
}

export const InputField = ({
  name,
  label,
  isRequired,
  ...props
}: InputFieldProps) => {
  const { control, setValue } = useFormContext();

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
            <Input
              {...props}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              status={fieldState.invalid ? 'error' : undefined}
              className={`h-10 w-full ${fieldState.invalid ? '!border-red-500' : ''} ${
                props.disabled ? 'bg-gray-200' : ''
              }`}
              onBlur={() => {
                const trimmed = field.value?.trim();
                setValue(name, trimmed, { shouldValidate: true });
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text').trim();
                setValue(name, pastedText, { shouldValidate: true });
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' && field.value === '') {
                  e.preventDefault();
                }
              }}
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
