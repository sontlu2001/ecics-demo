import { Input, Select, SelectProps } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';

import { useHandleClickOutside } from '@/hook/useHandleClickOutside';

interface DropdownFieldProps extends SelectProps {
  name: string;
  options: DropdownOption[];
  label?: string;
  className?: string;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  notFoundContent?: React.ReactNode;
  isRequired?: boolean;
}

export interface DropdownOption {
  value: string | number;
  text: string;
}

export interface OptionType {
  value: string;
  label: JSX.Element;
}

interface AddOnDropDownFieldProps {
  options: OptionType[];
  selectedOption: string;
  handleSelectOption: (value: string) => void;
  isPending: boolean;
}

export const DropdownField = ({
  name,
  label,
  options,
  disabled,
  className,
  renderOption,
  isRequired,
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
            {label && (
              <span className='text-base font-semibold'>
                {label}
                {isRequired && (
                  <span className='font-semibold text-[#C80F1E]'>*</span>
                )}
              </span>
            )}
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
              className={`custom-select h-10 w-full ${fieldState.invalid ? '!border-red-500' : ''}`}
              suffixIcon={
                <ArrowDownIcon
                  size={20}
                  className={
                    disabled
                      ? 'text-[rgba(0,0,0,0.25)]'
                      : 'text-[rgba(0,0,0,0.85)]'
                  }
                />
              }
              placement='bottomRight'
              dropdownStyle={{
                maxWidth: '100vw',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
              onFocus={() => {
                document.documentElement.style.overflow = 'hidden';
              }}
              onBlur={() => {
                document.documentElement.style.overflow = '';
              }}
              getPopupContainer={() => document.body} // Make sure the dropdown outside the parent class has scrolling
              // virtual={false} // to resolve the scrolling bug for ant design exist after Ant v4.6 but may be less performant with very large option lists
              // // https://github.com/ant-design/ant-design/issues/26480
            >
              {options.map((option: DropdownOption) => (
                <Select.Option key={option.value} value={option.value}>
                  {renderOption ? renderOption(option) : option.text}
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

export const LongOptionDropdownField = ({
  name,
  label,
  options,
  disabled,
  renderOption,
  isRequired,
  notFoundContent,
  ...props
}: DropdownFieldProps) => {
  const { control } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
    'down',
  );

  const handlePosition = useCallback(() => {
    if (!isDropdownOpen || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const newDirection =
      spaceBelow < 200 && spaceAbove > spaceBelow ? 'up' : 'down';
    setDropdownDirection(newDirection);
  }, [isDropdownOpen]);

  useEffect(() => {
    window.addEventListener('scroll', handlePosition, true);
    window.addEventListener('resize', handlePosition);

    return () => {
      window.removeEventListener('scroll', handlePosition, true);
      window.removeEventListener('resize', handlePosition);
    };
  }, [handlePosition]);

  useEffect(() => {
    setSearchTerm('');
    setIsDropdownOpen(false);
  }, []);

  const filteredOptions = useMemo(() => {
    return searchTerm === ''
      ? options
      : options.filter((opt) =>
          opt.text.toLowerCase().includes(searchTerm.toLowerCase()),
        );
  }, [searchTerm, options]);

  useHandleClickOutside(containerRef, () => setIsDropdownOpen(false));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected = options.find((opt) => opt.value === field.value);

        return (
          <div
            className={props.className}
            ref={containerRef}
            style={{ position: 'relative' }}
          >
            {label && (
              <label className='text-base font-semibold'>
                {label}
                {isRequired && <span className='text-red-500'>*</span>}
              </label>
            )}
            <Input
              {...field}
              type='text'
              placeholder={`Select ${label?.toLowerCase() || ''}`}
              value={selected?.text || ''}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              disabled={disabled}
              readOnly
              status={fieldState.invalid ? 'error' : undefined}
              className='w-full truncate rounded border px-3 py-2 pr-8'
            />
            <span
              className={`absolute right-3 transform cursor-pointer pt-[10px] ${disabled ? 'pointer-events-none' : ''}`}
              onClick={() => {
                if (!disabled) setIsDropdownOpen((prev) => !prev);
              }}
            >
              <ArrowDownIcon size={20} />
            </span>
            {isDropdownOpen && (
              <div
                className='absolute z-50 w-full rounded border bg-white shadow-lg'
                style={{
                  top: dropdownDirection === 'down' ? '100%' : undefined,
                  bottom: dropdownDirection === 'up' ? '100%' : undefined,
                  transform:
                    dropdownDirection === 'up'
                      ? 'translateY(-4px)'
                      : 'translateY(4px)',
                }}
              >
                <div className='sticky top-0 z-10 border-b bg-white px-3 py-2'>
                  <input
                    type='text'
                    placeholder='Search...'
                    className='w-full rounded border px-2 py-1 text-sm'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>

                <ul className='max-h-60 overflow-auto'>
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                      <li
                        key={opt.value}
                        className='cursor-pointer px-3 py-2 hover:bg-blue-100'
                        aria-selected={field.value === opt.value}
                        onClick={() => {
                          field.onChange(opt.value);
                          setSearchTerm('');
                          setIsDropdownOpen(false);
                        }}
                      >
                        {renderOption ? renderOption(opt) : opt.text}
                      </li>
                    ))
                  ) : (
                    <li className='px-3 py-2 text-gray-400'>
                      {notFoundContent || 'No options found'}
                    </li>
                  )}
                </ul>
              </div>
            )}
            {fieldState.error && (
              <span className='block text-sm text-red-500'>
                {fieldState.error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export const AddOnDropDownField = ({
  options,
  selectedOption,
  handleSelectOption,
  isPending,
}: AddOnDropDownFieldProps) => {
  return (
    <Select
      style={{ width: 120 }}
      className='[&_.ant-select-selector]:border-0.5 w-28 [&_.ant-select-selector]:border-[#00ADEF]'
      options={options}
      value={selectedOption}
      placeholder='Select'
      onChange={(value) => handleSelectOption(value)}
      placement='bottomRight'
      dropdownStyle={{
        minWidth: 112,
        width: 'fit-content',
        maxWidth: '100vw',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
      disabled={isPending}
    />
  );
};
