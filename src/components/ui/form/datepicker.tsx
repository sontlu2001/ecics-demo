import { DatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

interface DatePickerFieldProps extends Omit<DatePickerProps, 'value'> {
  name: string;
  label?: string;
}

export const DatePickerField = ({
  name,
  label,
  format = 'DD/MM/YYYY',
  ...props
}: DatePickerFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <span className='text-base font-semibold'>{label}</span>
          <DatePicker
            {...props}
            format={format}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              // Convert dayjs to Date for react-hook-form
              field.onChange(date ? date.toDate() : null);
            }}
            status={fieldState.invalid ? 'error' : undefined}
            className={`w-full ${fieldState.invalid ? '!border-red-500' : ''}`}
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
