'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, Form, Input, Select } from 'antd';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import DeleteIcon from '@/components/icons/DeleteIcon';
export type Status = 'new' | 'completed';

const schema = z.object({
  name: z
    .string()
    .min(5, { message: 'Input is required' })
    .max(20, { message: 'Input must be between 5 and 20 characters' }),
  nric: z.string(),
  gender: z.string().min(1, { message: 'Input is required' }),
  maritalStatus: z.string().min(1, { message: 'Input is required' }),
  drivingExperience: z.string().min(1, { message: 'Input is required' }),
  dateOfBirth: z.string().min(1, { message: 'Input is required' }),
});

type FormData = z.infer<typeof schema>;

export default function AddOnAddPersonForm({
  children,
}: {
  children?: React.ReactNode;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Submitted data:', data);
  };

  return (
    <div className='rounded-md bg-gray-100 p-4'>
      <div className='flex justify-between'>
        <p className='text-lg font-semibold'>Additional Driver 1</p>
        <DeleteIcon />
      </div>
      <Form onFinish={handleSubmit(onSubmit)} className='mt-4'>
        <Form.Item
          label='Name as Per NRIC'
          validateStatus={errors.nric ? 'error' : ''}
          help={errors.nric?.message}
        >
          <Controller
            control={control}
            name='nric'
            render={({ field }) => (
              <Input {...field} placeholder='Enter name' />
            )}
          />
        </Form.Item>
        <Form.Item
          label='NRIC'
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <Input {...field} placeholder='Enter name' />
            )}
          />
        </Form.Item>
        <Form.Item
          label='Date of Birth'
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name='dateOfBirth'
            render={({ field }) => (
              <DatePicker
                {...field}
                placeholder='Select date'
                className='w-full'
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label='Gender'
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name='gender'
            render={({ field }) => (
              <Select {...field} placeholder='Select an option'>
                <Select.Option value='option1'>Male</Select.Option>
                <Select.Option value='option2'>Female</Select.Option>
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item
          label='Marital Status'
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name='maritalStatus'
            render={({ field }) => (
              <Select {...field} placeholder='Select an option'>
                <Select.Option value='option1'>Married</Select.Option>
                <Select.Option value='option2'>No Married</Select.Option>
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item
          label='Driving Experience'
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name='drivingExperience'
            render={({ field }) => (
              <Select {...field} placeholder='Select an option'>
                <Select.Option value='option1'>0</Select.Option>
                <Select.Option value='option1'>1</Select.Option>
                <Select.Option value='option2'>2</Select.Option>
                <Select.Option value='option2'>3</Select.Option>
                <Select.Option value='option2'>4</Select.Option>
              </Select>
            )}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
