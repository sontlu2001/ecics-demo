import { Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

const { TextArea } = Input;

interface TextAreaFieldProps {
  name: string;
  label?: string;
  rows?: number;
  [key: string]: any;
}

export const TextAreaField = ({
  name,
  label,
  rows = 1,
  ...props
}: TextAreaFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <span className='text-base font-semibold'>{label}</span>
          <TextArea
            {...props}
            {...field}
            status={fieldState.invalid ? 'error' : undefined}
            className={`w-full ${fieldState.invalid ? '!border-red-500' : ''} min-h-[32px]`} // Added Tailwind min-height class
            rows={rows}
            style={{
              height: '32px',
              minHeight: '32px',
              resize: 'both',
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
  );
};
