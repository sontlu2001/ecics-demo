import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Drawer, Modal } from 'antd';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useEffect, useMemo } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import dayjs from 'dayjs';

import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
import { validateNRIC } from '@/libs/utils/validation-utils';

import { DeleteIcon } from '@/components/icons/add-on-icons';
import { DatePickerField } from '@/components/ui/form/datepicker';
import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import RadioField from '@/components/ui/form/radiofield';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

import {
  DRV_EXP_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  NumberDriverExperience,
} from '../basic-detail/options';

enum ClaimStatus {
  YES = 'true',
  NO = 'false',
}

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
            .date({
              required_error: 'Date of birth is required',
              invalid_type_error: 'Date of birth is required',
            })
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
                message: 'Invalid age. Driver must be older than 26 years.',
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
            .string({
              required_error: 'Driving experience field is required',
              invalid_type_error: 'Driving experience field is required',
            })
            .refine((val) => val !== NumberDriverExperience.LESS_THAN_2_YEARS, {
              message:
                'Invalid driving experience. Driver must have at least 2 years of driving experience.',
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
  const initDriver = {
    name: '',
    nric_or_fin: '',
    date_of_birth: null,
    gender: null,
    marital_status: null,
    driving_experience: null,
    is_claim_in_3_years: ClaimStatus.NO,
  };
  const schema = useMemo(
    () => createSchema(policyStartDate),
    [policyStartDate],
  );
  const { isMobile } = useDeviceDetection();

  const drivers = dataDrivers.map((driver) => ({
    ...driver,
    date_of_birth: driver.date_of_birth
      ? dayjs(driver.date_of_birth, 'DD/MM/YYYY').toDate()
      : null,
  }));
  const initDrivers = dataDrivers.length === 0 ? [initDriver] : drivers;

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
  const formValues = methods.watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'drivers',
  });

  const handleAddDriver = () => {
    if (fields.length < 3) {
      append(initDriver as any);
    }
  };

  // Use an effect to scroll the last driver field into view when fields change
  useEffect(() => {
    if (fields.length > 0) {
      // Get the last field's element by its id (which is set to field.id)
      const lastFieldElement = document.getElementById(
        fields[fields.length - 1].id,
      );
      if (lastFieldElement) {
        lastFieldElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [fields]);

  const handleRemoveDriver = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: FormData) => {
    const formattedDrivers = data.drivers.map((driver) => ({
      ...driver,
      date_of_birth: dayjs(driver.date_of_birth).format('DD/MM/YYYY'),
    }));
    setDataDrivers(formattedDrivers);
    setIsShowAdditionDriver(false);
  };

  const _renderFormInput = () => {
    return (
      <>
        {fields.map((field, index) => {
          const selectedDate = field?.date_of_birth
            ? dayjs(field?.date_of_birth)
            : null;
          return (
            <div
              key={field.id}
              className='flex w-full flex-col gap-3 rounded-lg border border-[#E5E5E5] bg-[#8189940F] px-4 py-2'
              id={field.id}
            >
              <div className='flex w-full flex-row items-center justify-between'>
                <p className='text-xl font-semibold text-[#080808]'>
                  Additional Driver {index + 1}
                </p>
                <div className='mt-3'>
                  {formValues.drivers.length > 1 && (
                    <DeleteIcon
                      className='cursor-pointer text-red-500'
                      onClick={() => handleRemoveDriver(index)}
                    />
                  )}
                </div>
              </div>

              <InputField
                name={`drivers.${index}.name`}
                label='Name as Per NRIC/FIN'
                placeholder='Enter your Name'
              />
              <InputField
                name={`drivers.${index}.nric_or_fin`}
                label='NRIC/FIN'
                placeholder='Enter NRIC/FIN'
              />
              <DatePickerField
                name={`drivers.${index}.date_of_birth`}
                label='Date of Birth'
                minDate={adjustDateInDayjs(
                  dateToDayjs(policyStartDate as Date),
                  -71,
                  0,
                  1,
                )}
                maxDate={adjustDateInDayjs(
                  dateToDayjs(policyStartDate as Date),
                  -18,
                  0,
                  0,
                )}
                defaultPickerValue={
                  selectedDate ??
                  adjustDateInDayjs(
                    dateToDayjs(policyStartDate as Date),
                    -27,
                    0,
                    0,
                  )
                }
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
                  { value: ClaimStatus.YES, text: 'Yes' },
                  { value: ClaimStatus.NO, text: 'No' },
                ]}
              />
            </div>
          );
        })}
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
          <div className='flex flex-row justify-end'>
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
      <div className='mb-14 h-[70svh] overflow-y-scroll'>{content}</div>
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
      <div className='mb-14 h-[80vh] overflow-y-scroll'>{content}</div>
    </Modal>
  );
};

export default AdditionDriver;
