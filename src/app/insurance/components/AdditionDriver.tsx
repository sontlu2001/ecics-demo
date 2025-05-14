import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Drawer, Form, Modal } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import DeleteIcon from '@/components/icons/DeleteIcon';
import { DatePickerField } from '@/components/ui/form/datepicker';
import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

import {
  DRV_EXP_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '../basic-detail/options';
import { validateNRIC } from '@/libs/utils/validation-utils';
import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
import dayjs from 'dayjs';
import RadioField from '@/components/ui/form/radiofield';

interface Props {
  isShowAdditionDriver: boolean;
  setIsShowAdditionDriver: (value: boolean) => void;
  setDataDrivers: (data: any[]) => void;
  dataDrivers: any[];
  policyStartDate: Date;
}

const createSchema = (policyStartDate: Date) =>
  z.object({
    drivers: z
      .array(
        z.object({
          name: z
            .string({
              required_error: 'Name is required',
            })
            .min(3, 'Name must be at least 3 characters')
            .max(60, 'Name must be at most 60 characters')
            .nonempty('Name is required'),
          nric_or_fin: z
            .string({
              required_error: 'NRIC/FIN is required',
            })
            .nonempty('NRIC/FIN is required')
            .refine((val) => validateNRIC([val]), {
              message: 'Please enter a valid NRIC/FIN.',
            }),
          date_of_birth: z
            .date({ required_error: 'Date of birth is required' })
            .refine(
              (dob) => {
                const minDob = adjustDateInDayjs(
                  dateToDayjs(policyStartDate as Date),
                  -26,
                  0,
                  0,
                );
                return dayjs(dob as Date).isSameOrBefore(minDob);
              },
              {
                message: 'Driver must be older than 26 years.',
              },
            ),
          gender: z.string({
            required_error: 'Gender is required',
            invalid_type_error: 'Gender is required',
          }),
          marital_status: z.string({
            required_error: 'Marital status is required',
            invalid_type_error: 'Marital status is required',
          }),
          driving_experience: z
            .number({
              invalid_type_error: 'Driving experience is required',
              required_error: 'Driving experience is required',
            })
            .refine((val) => val > 1, {
              message:
                'Driver must have at least 2 years of driving experience.',
            }),
          is_claim_in_3_years: z
            .string({
              required_error: 'Claim status is required',
              invalid_type_error: 'Claim status is required',
            })
            .refine((val) => val !== 'true', {
              message: 'Driver must have no claims in the past 3 years.',
            }),
        }),
      )
      .superRefine((drivers, ctx) => {
        // Build a map of NRIC/FIN value => array of field indices with that value.
        const nricMap: Record<string, number[]> = {};
        drivers.forEach((driver, index) => {
          const nric = driver.nric_or_fin;
          if (nric) {
            if (!nricMap[nric]) {
              nricMap[nric] = [index];
            } else {
              nricMap[nric].push(index);
            }
          }
        });

        // Check duplicates: for any value that appears more than once, add a custom issue
        Object.entries(nricMap).forEach(([nric, indices]) => {
          if (indices.length > 1) {
            indices.forEach((idx) => {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'NRIC/FIN must be unique',
                path: [idx, 'nric_or_fin'],
              });
            });
          }
        });
      }),
  });
type FormData = z.infer<ReturnType<typeof createSchema>>;

const AdditionDriver = ({
  isShowAdditionDriver,
  setIsShowAdditionDriver,
  setDataDrivers,
  dataDrivers,
  policyStartDate,
}: Props) => {
  const dob = adjustDateInDayjs(
    dateToDayjs(policyStartDate as Date),
    -27,
    0,
    0,
  )?.toDate();
  const defaultDriver = {
    name: '',
    nric_or_fin: '',
    date_of_birth: dob,
    gender: null,
    marital_status: null,
    driving_experience: null,
  };
  const schema = useMemo(
    () => createSchema(policyStartDate),
    [policyStartDate],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const initDrivers = dataDrivers.length === 0 ? [defaultDriver] : dataDrivers;

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { drivers: initDrivers },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'drivers',
  });
  const { isMobile } = useDeviceDetection();

  const handleAddDriver = () => {
    if (fields.length < 3) {
      append({} as any);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  };

  const handleRemoveDriver = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: FormData) => {
    setDataDrivers(data.drivers);
    setIsShowAdditionDriver(false);
  };

  const _renderFormInput = () => {
    return (
      <>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className='flex w-full flex-col gap-3 rounded-lg border border-[#E5E5E5] bg-[#8189940F] px-4 py-2'
          >
            <div className='flex w-full flex-row items-center justify-between'>
              <p className='text-xl font-semibold text-[#080808]'>
                Additional Driver {index + 1}
              </p>
              <div className='mt-3'>
                <DeleteIcon
                  className='cursor-pointer text-red-500'
                  onClick={() => handleRemoveDriver(index)}
                />
              </div>
            </div>

            <InputField
              name={`drivers.${index}.name`}
              label='Name as Per NRIC'
              placeholder='Enter your Name'
            />
            <InputField
              name={`drivers.${index}.nric_or_fin`}
              label='NRIC'
              placeholder='Enter NRIC/FIN'
            />
            <DatePickerField
              name={`drivers.${index}.date_of_birth`}
              label='Date of Birth'
              minDate={adjustDateInDayjs(dayjs(), -71, 0, 1)}
              maxDate={adjustDateInDayjs(dayjs(), -18, 0, 0)}
            />
            <DropdownField
              name={`drivers.${index}.gender`}
              label='Gender'
              placeholder='Select gender'
              options={GENDER_OPTIONS}
            />
            <DropdownField
              name={`drivers.${index}.marital_status`}
              label='Marital Status'
              placeholder='Select marital status'
              options={MARITAL_STATUS_OPTIONS}
            />
            <DropdownField
              name={`drivers.${index}.driving_experience`}
              label='Driving Experience'
              placeholder='Select driving experience'
              options={DRV_EXP_OPTIONS}
            />
            <RadioField
              name={`drivers.${index}.is_claim_in_3_years`}
              label='Do you have a claim in the past 3 years?'
              options={[
                { value: 'true', text: 'Yes' },
                { value: 'false', text: 'No' },
              ]}
            />
          </div>
        ))}
      </>
    );
  };

  const content = (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-full w-full flex-col gap-4 md:gap-8'
      >
        {_renderFormInput()}
        {fields.length < 3 && (
          <div className='flex flex-row justify-end' ref={scrollRef}>
            <button
              className='flex flex-row items-center gap-2 rounded-md border border-[#00ADEF] px-4 py-2 text-sm font-normal text-[#00ADEF]'
              onClick={handleAddDriver}
              type='button'
            >
              <PlusOutlined />
              <p>Add more driver</p>
            </button>
          </div>
        )}
        <div className='absolute bottom-0 left-0 flex w-full flex-row justify-between gap-4 rounded-md bg-[#DCDDDC4F] px-6 py-4 text-base font-bold leading-[21px]'>
          <button
            className='rounded-md border border-[#0096D8] bg-white px-8 py-2 text-[#00ADEF]'
            type='button'
            onClick={() => setIsShowAdditionDriver(false)}
          >
            Cancel
          </button>
          <button
            className='rounded-md bg-[#00ADEF] px-8 py-2 text-white'
            type='submit'
          >
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );

  return isMobile ? (
    <Drawer
      placement='bottom'
      open={isShowAdditionDriver}
      closable={false}
      height='auto'
      className='w-full rounded-t-xl'
      onClose={() => setIsShowAdditionDriver(false)}
    >
      <div className='mb-14 h-[80vh] overflow-y-scroll'>{content}</div>
    </Drawer>
  ) : (
    <Modal
      open={isShowAdditionDriver}
      closable={false}
      onCancel={() => setIsShowAdditionDriver(false)}
      maskClosable={false}
      keyboard={false}
      footer={null}
      centered
      width={600}
    >
      <div className='mb-14 h-[85vh] overflow-y-scroll'>{content}</div>
    </Modal>
  );
};

export default AdditionDriver;
