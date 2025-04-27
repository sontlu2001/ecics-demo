import { CloseOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, InputProps } from 'antd';
import { Controller, useForm } from 'react-hook-form';

import { SecondaryButton } from '@/components/ui/buttons';

import { MOTOR_QUOTE } from '@/constants';

interface InputFieldProps extends InputProps {
  fieldKey: string;
  onCancel: () => void;
  onSubmitPromoCode: (promoCode: string) => void;
  errorMessage?: string;
  defaultPromoCode?: PromoCodeModel | null;
  appliedPromoCode?: PromoCodeModel | null;
}

export interface PromoCodeModel {
  code: string;
  desc: string;
}

export const PromoCodeField = ({
  fieldKey,
  onCancel,
  onSubmitPromoCode,
  errorMessage,
  defaultPromoCode,
  appliedPromoCode,
  ...props
}: InputFieldProps) => {
  const { control, getValues } = useForm();
  const handleSubmitPromoCode = () => {
    const promoCode = getValues(MOTOR_QUOTE.quick_proposal_promo_code);
    onSubmitPromoCode(promoCode);
  };
  return (
    <>
      {appliedPromoCode ? (
        // if Promo Code provided
        <Flex
          align='center'
          className='mb-5 w-full max-w-fit justify-between rounded-md border border-blue-400 px-3 py-2'
        >
          <span className='text-base'>Promo Code</span>
          <span className='px-3 sm:px-6'>
            <span className='pr-1 text-sm font-semibold text-blue-400'>
              {appliedPromoCode.code}:
            </span>
            <span className='text-sm'>{appliedPromoCode.desc} off applied</span>
          </span>
          <Button
            type='link'
            icon={<CloseOutlined />}
            danger
            onClick={onCancel}
          />
        </Flex>
      ) : (
        // if there is no promo code provided
        <>
          <Form.Item
            name={MOTOR_QUOTE.quick_proposal_promo_code}
            required={false}
            validateStatus={errorMessage ? 'error' : ''}
            className='mx-1 border p-3 font-semibold shadow-xl'
          >
            <div className='w-full'>Enter Promo Code</div>
            <Flex gap={'small'} className='w-full justify-between'>
              <Controller
                name={MOTOR_QUOTE.quick_proposal_promo_code}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={`w-3/4 py-2 ${errorMessage ? '!border-red-500' : ''}`}
                    {...props}
                  />
                )}
              />
              <SecondaryButton
                htmlType='button'
                onClick={handleSubmitPromoCode}
                className='w-1/4'
              >
                Apply
              </SecondaryButton>
            </Flex>
            {/* if there is default promoting promo code */}
            {defaultPromoCode ? (
              <div>
                <span className='text-blue-400'>
                  <TagOutlined />
                </span>
                <span className='pl-1 text-green-500'>
                  Use {defaultPromoCode.code} for {defaultPromoCode.desc} off
                </span>
              </div>
            ) : null}
          </Form.Item>
        </>
      )}
    </>
  );
};
