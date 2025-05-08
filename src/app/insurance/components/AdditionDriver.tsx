import DeleteIcon from '@/components/icons/DeleteIcon';
import { DatePickerField } from '@/components/ui/form/datepicker';
import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { PlusOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Drawer, Modal } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '../basic-detail/options';

interface Props {
  isShowAdditionDriver: boolean;
  setIsShowAdditionDriver: (value: boolean) => void;
  setDataDrivers: (data: any[]) => void;
  dataDrivers: any[];
}
export const DRIVING_EXPERIENCE_OPTIONS = [
  { value: 0, text: 'Less than 1 year' },
  { value: 1, text: '1 year' },
  { value: 2, text: '2 years' },
  { value: 3, text: '3 years' },
  { value: 4, text: '4 years' },
  { value: 5, text: '5 years' },
  { value: 6, text: '6 years and above' },
];
const createSchema = () =>
  z.object({
    drivers: z.array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        nric_or_fin: z.string().min(1, 'NRIC/FIN is required'),
        date_of_birth: z
          .date({ required_error: 'Date of birth is required' })
          .refine(
            (date) => date <= new Date(),
            'Date of birth cannot be in the future',
          ),
        gender: z.string().min(1, 'Gender is required'),
        marital_status: z.string().min(1, 'Marital status is required'),
        driving_experience: z.number().min(1, 'Driving experience is required'),
      }),
    ),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

const AdditionDriver = ({
  isShowAdditionDriver,
  setIsShowAdditionDriver,
  setDataDrivers,
  dataDrivers,
}: Props) => {
  const schema = useMemo(() => createSchema(), []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { drivers: dataDrivers },
    mode: 'onSubmit',
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

  const [isWarningDriver, setIsWarningDriver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const onChangeDriver = (value: string) => {
    if (value === '1 year' || value === 'Less than 1 year') {
      setIsWarningDriver(true);
      setErrorMessage('Premium Increases for old/young/inexperienced drivers.');
    } else {
      setIsWarningDriver(false);
      setErrorMessage('');
    }
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
              options={DRIVING_EXPERIENCE_OPTIONS}
              onChange={onChangeDriver}
            />

            {isWarningDriver && (
              <p className='text-sm text-red-500'>{errorMessage}</p>
            )}
          </div>
        ))}
      </>
    );
  };

  const content = (
    <>
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
      <div className='flex w-full flex-row justify-between gap-4 rounded-md bg-[#DCDDDC4F] px-8 py-2 text-base font-bold leading-[21px]'>
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
    </>
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
      <div
        style={{ maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex w-full flex-col gap-8 py-6'
          >
            {content}
          </form>
        </FormProvider>
      </div>
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
      <div style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-8 py-6'
          >
            {content}
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default AdditionDriver;
