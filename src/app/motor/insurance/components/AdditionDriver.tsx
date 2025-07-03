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
import { calculateAge } from '@/libs/utils/utils';
import { validateNRIC } from '@/libs/utils/validation-utils';

import { DatePickerField } from '@/components/ui/form/datepicker';
import { InputField } from '@/components/ui/form/inputfield';
import { InputNumberField } from '@/components/ui/form/inputnumberfield';
import { RadioField } from '@/components/ui/form/radiofield';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
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
  allDrivers: any[];
  editingIndex?: number | null;
  policyStartDate: Date;
}

const createSchema = (
  policyStartDate: Date,
  allDrivers: any[],
  editingIndex: number | null,
) =>
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
          driving_experience: z.coerce
            .number({
              required_error: 'This field is required',
              invalid_type_error: 'This field is required',
            })
            .min(2, {
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
        const existingNrics = allDrivers
          .map((d, idx) =>
            editingIndex !== null && idx === editingIndex
              ? null
              : d.nric_or_fin,
          )
          .filter(Boolean);

        drivers.forEach((driver, index) => {
          if (existingNrics.includes(driver.nric_or_fin)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'NRIC/FIN must be unique',
              path: [index, 'nric_or_fin'],
            });
          }

          // driver experience validation based on age at policy start date
          if (driver.date_of_birth && driver.driving_experience != null) {
            const age = calculateAge(
              driver.date_of_birth.toISOString(),
              policyStartDate,
            );
            const maxDrvExp = age - 18;
            if (driver.driving_experience > maxDrvExp) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Please provide driving experience suitable for the driver's age.",
                path: [index, 'driving_experience'],
              });
            }
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
  allDrivers,
  editingIndex,
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
    () => createSchema(policyStartDate, allDrivers, editingIndex ?? null),
    [policyStartDate, allDrivers, editingIndex],
  );
  const { isMobile } = useDeviceDetection();

  const drivers = dataDrivers.map((driver) => ({
    ...driver,
    date_of_birth: driver.date_of_birth
      ? dayjs(driver.date_of_birth, 'DD/MM/YYYY').toDate()
      : null,
  }));
  const initDrivers = drivers.length === 0 ? [initDriver] : drivers;
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
      nric_or_fin: driver.nric_or_fin?.toUpperCase(),
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
              className='flex w-full flex-col gap-3 rounded-lg py-2 md:px-4'
              id={field.id}
            >
              <div className='flex w-full flex-row items-center justify-between'>
                <p className='w-full text-center text-xl font-semibold text-[#080808]'>
                  {editingIndex !== null && editingIndex !== undefined
                    ? 'Edit Additional Driver'
                    : 'Add Additional Driver'}
                </p>
              </div>

              <div className='flex w-full flex-col gap-3 md:grid md:grid-cols-2 md:gap-5'>
                <div className='flex flex-col gap-2'>
                  <InputField
                    name={`drivers.${index}.name`}
                    label='Name as Per NRIC/FIN'
                    placeholder='Full name as per NRIC'
                    isRequired={true}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <InputField
                    name={`drivers.${index}.nric_or_fin`}
                    label='NRIC/FIN'
                    placeholder='Enter NRIC/FIN'
                    isRequired={true}
                  />
                </div>
                <div className='flex flex-col gap-2'>
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
                    isRequired={true}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <RadioField
                    name={`drivers.${index}.gender`}
                    label='Gender'
                    options={GENDER_OPTIONS}
                    isRequired={true}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <RadioField
                    name={`drivers.${index}.marital_status`}
                    label='Marital Status'
                    options={MARITAL_STATUS_OPTIONS}
                    className='flex flex-col'
                    isRequired={true}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <InputNumberField
                    name={`drivers.${index}.driving_experience`}
                    label='Driving Experience'
                    placeholder='Enter driving experience'
                    isRequired={true}
                    min={0}
                    max={60}
                    suffix='year(s)'
                    precision={0}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <RadioField
                    name={`drivers.${index}.is_claim_in_3_years`}
                    label='Do you have a claim in the past 3 years?'
                    options={[
                      { value: ClaimStatus.YES, text: 'Yes' },
                      { value: ClaimStatus.NO, text: 'No' },
                    ]}
                    isRequired={true}
                  />
                </div>
              </div>
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
        <div className='absolute bottom-0 left-0 flex w-full flex-row justify-center gap-4 rounded-md bg-white px-6 py-4 text-base font-bold leading-[21px]'>
          <button
            className='rounded-md border border-[#525252] bg-white px-8 py-2 text-[#525252]'
            type='button'
            onClick={() => setIsShowAdditionDriver(false)}
          >
            Back
          </button>
          <button
            className='rounded-md bg-[#00ADEF] px-8 py-2 text-white'
            type='submit'
          >
            {editingIndex !== null && editingIndex !== undefined
              ? 'Save'
              : 'Add'}
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
      width={765}
    >
      <div className='mb-14 max-h-[80vh] overflow-y-scroll'>{content}</div>
    </Modal>
  );
};

export default AdditionDriver;
