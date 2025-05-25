import { DatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import CalendarIcon from '@/components/icons/CalendarIcon';

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
      render={({ field, fieldState }) => {
        return (
          <>
            <span className='text-base font-semibold'>{label}</span>
            <DatePicker
              {...props}
              {...field}
              format={format}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => {
                // Convert dayjs to Date for react-hook-form
                field.onChange(date ? date.toDate() : null);
                props.onChange?.(date, date ? date.format('DD/MM/YYYY') : '');
              }}
              status={fieldState.invalid ? 'error' : undefined}
              suffixIcon={
                <CalendarIcon
                  size={24}
                  className={
                    props.disabled
                      ? 'text-[rgba(0,0,0,0.25)]'
                      : 'text-[rgba(0,0,0,0.85)]'
                  }
                />
              }
              inputReadOnly={true}
              className={`h-10 w-full ${fieldState.invalid ? '!border-red-500' : ''}`}
            />
            {fieldState.error && (
              <span className='block text-sm text-red-500'>
                {fieldState.error.message}
              </span>
            )}
          </>
        );
      }}
    />
  );
};
