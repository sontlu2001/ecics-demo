import { CloseOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, InputProps } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SecondaryButton } from '@/components/ui/buttons';

import { PromoCodeResponse } from '@/api/base-service/verify';
import { MOTOR_QUOTE } from '@/constants';
import { useVerifyPromoCode } from '@/hook/insurance/common';

interface InputFieldProps extends InputProps {
  isDisablePromoCode: boolean;
  applyPromoCode: string;
  setApplyPromoCode: (promoCode: string) => void;
}
export interface PromoCodeModel {
  code: string;
  desc: string;
}

export const PromoCodeField = ({
  isDisablePromoCode,
  applyPromoCode,
  setApplyPromoCode,
  ...props
}: InputFieldProps) => {
  const { control, getValues, setValue } = useFormContext();
  const { mutate: verifyPromoCode, data, isPending } = useVerifyPromoCode();
  const [promoInfoSelected, setPromoInfoSelected] =
    useState<PromoCodeResponse | null>(null);
  const isValidPromoCode = promoInfoSelected?.data?.is_valid;
  const errorMessage = isValidPromoCode ? '' : promoInfoSelected?.message;

  useEffect(() => {
    if (!isValidPromoCode) {
      setApplyPromoCode('');
    } else {
      setApplyPromoCode(promoInfoSelected?.data.code);
    }
  }, [isValidPromoCode]);

  useEffect(() => {
    if (!data) return;
    setPromoInfoSelected(data);
  }, [data]);

  // Automatically verify the default promo code on mount (if provided).
  useEffect(() => {
    if (applyPromoCode) {
      verifyPromoCode(applyPromoCode);
    }
  }, [applyPromoCode]);

  const handleSubmitPromoCode = () => {
    const promoCode = getValues(MOTOR_QUOTE.quick_proposal_promo_code);
    if (promoCode) {
      verifyPromoCode(promoCode);
    }
  };

  const removePromoCode = () => {
    setPromoInfoSelected(null);
    setValue(MOTOR_QUOTE.quick_proposal_promo_code, '');
  };

  return (
    <div>
      {isDisablePromoCode && (
        <div>
          <Input disabled />
          <span className='block pt-2 text-xs text-gray-400'>
            Unable to apply Promo Code. Past claim founds.
          </span>
        </div>
      )}
      {!isDisablePromoCode && isValidPromoCode && (
        <Flex
          align='center'
          className='mb-5 w-full max-w-fit justify-between rounded-md border border-blue-400 px-3 py-2'
        >
          <span className='text-base'>Promo Code</span>
          <span className='inline-block px-3 sm:px-6'>
            <span className='pr-1 text-sm font-semibold text-blue-400'>
              {promoInfoSelected?.data.code}:
            </span>
            <span className='text-sm'>
              {promoInfoSelected?.data?.discount} % off applied
            </span>
          </span>
          <Button
            type='link'
            icon={<CloseOutlined />}
            danger
            onClick={removePromoCode}
          />
        </Flex>
      )}
      {!isDisablePromoCode && !isValidPromoCode && (
        <Form.Item
          name={MOTOR_QUOTE.quick_proposal_promo_code}
          required={false}
          validateStatus={errorMessage ? 'error' : ''}
          className='mx-1 border p-3 font-semibold shadow-xl'
        >
          <div className='w-full'>Enter Promo Code</div>
          <Flex gap='small' className='w-full justify-between'>
            <Controller
              name={MOTOR_QUOTE.quick_proposal_promo_code}
              control={control}
              defaultValue={applyPromoCode}
              render={({ field }) => (
                <Input
                  {...field}
                  className={`w-3/4 py-2 ${errorMessage ? '!border-red-500' : ''}`}
                  {...props}
                />
              )}
            />
            <SecondaryButton
              onClick={handleSubmitPromoCode}
              loading={isPending}
            >
              Apply
            </SecondaryButton>
          </Flex>
          {errorMessage && (
            <span className='block pt-2 text-sm text-red-500'>
              {errorMessage}
            </span>
          )}
          {isValidPromoCode && (
            <div>
              <span className='text-blue-400'>
                <TagOutlined />
              </span>
              <span className='pl-1 text-green-500'>
                Use {data?.data.code} for {data?.data.discount}% off
              </span>
            </div>
          )}
        </Form.Item>
      )}
    </div>
  );
};
