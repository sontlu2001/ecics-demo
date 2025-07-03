import { CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, InputProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import PromoTickIcon from '@/components/icons/PromoTickIcon';
import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { SecondaryButton } from '@/components/ui/buttons';

import { PromoCodeResponse } from '@/api/base-service/verify';
import { MOTOR_QUOTE } from '@/constants';
import { useVerifyPromoCode } from '@/hook/insurance/common';
import { setPromoCodeError } from '@/redux/slices/general.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

interface InputFieldProps extends InputProps {
  isDisablePromoCode: boolean;
  applyPromoCode: string;
  setApplyPromoCode: (promoCode: string) => void;
  product_type: string;
  isFormSubmitting?: boolean;
}

export interface PromoCodeModel {
  code: string;
  desc: string;
}

export const PromoCodeField = ({
  isDisablePromoCode,
  applyPromoCode,
  setApplyPromoCode,
  product_type,
  isFormSubmitting,
  ...props
}: InputFieldProps) => {
  const { control, getValues, setValue } = useFormContext();
  const { mutateAsync: verifyPromoCode, isPending } =
    useVerifyPromoCode(product_type);
  const [promoInfoSelected, setPromoInfoSelected] =
    useState<PromoCodeResponse | null>(null);
  const promoCodeError = useAppSelector(
    (state) => state.general.promoCodeError,
  );
  const dispatch = useAppDispatch();

  const isPromoCodeNotApplicable =
    promoCodeError?.message === 'Promo Code is invalid';
  const isValidPromoCode = promoInfoSelected?.data?.is_valid;
  const errorMessage = isValidPromoCode ? '' : promoInfoSelected?.message;

  const isExpiredPromoCode =
    promoInfoSelected?.message === 'This promo code has expired.';

  const handleVerifyPromoCode = async (promoCode: string) => {
    try {
      const response: any = await verifyPromoCode(promoCode);
      const isValid = response?.data?.is_valid;
      if (!isValid) {
        setApplyPromoCode('');
      } else {
        setApplyPromoCode(promoCode);
      }
      setPromoInfoSelected(response);
    } catch (error) {
      setPromoInfoSelected(null);
    }
  };

  // Automatically verify the default promo code on mount (if provided).
  useEffect(() => {
    if (applyPromoCode) {
      handleVerifyPromoCode(applyPromoCode);
    }
  }, [applyPromoCode]);

  const handleSubmitPromoCode = () => {
    dispatch(setPromoCodeError(null));
    const promoCode = getValues(MOTOR_QUOTE.promo_code);
    if (promoCode) {
      handleVerifyPromoCode(promoCode);
    }
  };

  const removePromoCode = () => {
    setPromoInfoSelected(null);
    setValue(MOTOR_QUOTE.promo_code, '');
    setApplyPromoCode('');
  };

  return (
    <div className='w-full'>
      {isDisablePromoCode && (
        <div className='mb-5 w-full border p-3 font-semibold md:ms-2'>
          <div className='mb-3 w-full text-base'>Enter Promo Code</div>
          <div className='flex items-center justify-between text-justify text-sm'>
            <WarningTriangleIcon className='mr-2 shrink-0' size={24} />
            <span className='text-justify font-light leading-snug'>
              We regret to inform you that the promo code is not applicable if
              <span className='font-bold underline'>
                {' '}
                you have made a claim within the past three years.
              </span>
            </span>
          </div>
        </div>
      )}
      {!isDisablePromoCode && isValidPromoCode && (
        <div className='mb-5 w-full border p-3 font-semibold md:ms-2'>
          <div className='mb-3 w-full text-base'>Enter Promo Code</div>
          <div className='mb-[10px] flex w-full items-center justify-between border border-gray-300 px-3 py-2'>
            <div className='flex items-center gap-2'>
              <span className='inline-block rounded px-3 py-1'>
                <span className='text-base font-semibold text-green-promo'>
                  {promoInfoSelected?.data.code}
                </span>
              </span>
            </div>
            <Button
              type='link'
              icon={<CloseOutlined className='text-xl' />}
              danger
              onClick={removePromoCode}
            />
          </div>
          {!isPromoCodeNotApplicable && (
            <span className='flex items-center text-sm text-green-promo'>
              <PromoTickIcon className='mr-2' size={24} />
              {promoInfoSelected?.data?.discount}% OFF applied
            </span>
          )}
          {isPromoCodeNotApplicable && (
            <div className='mt-[10px] flex items-center text-justify text-sm'>
              <WarningTriangleIcon className='mr-2' size={24} />
              <div className='text-[#FD1212]'>
                <span>Promo Code Not Applicable</span>
                <br />
                <span className='text-justify font-normal'>
                  This promo code is valid but doesn’t meet the required
                  criteria. Please check the terms and conditions.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {!isDisablePromoCode && !isValidPromoCode && (
        <Form.Item
          name={MOTOR_QUOTE.promo_code}
          required={false}
          validateStatus={errorMessage ? 'error' : ''}
          className='border p-3 font-semibold md:ms-2'
        >
          <div className='w-full'>Enter Promo Code</div>
          <Flex gap='small' className='w-full justify-between'>
            <Controller
              name={MOTOR_QUOTE.promo_code}
              control={control}
              defaultValue={applyPromoCode}
              render={({ field }) => (
                <Input
                  {...field}
                  className={`w-3/4 py-2 ${errorMessage ? '!border-red-500' : ''} hover:!border-gray-300 focus:!border-gray-300 focus:!shadow-none`}
                  {...props}
                />
              )}
            />
            <SecondaryButton
              onClick={handleSubmitPromoCode}
              loading={isPending}
              disabled={isPending || isFormSubmitting}
              className='ml-[16px] w-[150px] shadow-md shadow-gray-400'
            >
              Apply
            </SecondaryButton>
          </Flex>
          {isExpiredPromoCode && (
            <div className='mt-[10px] flex items-center text-justify text-sm'>
              <WarningTriangleIcon className='mr-2' size={24} />
              <div className='text-[#FD1212]'>
                <span>Expired Promo Code</span>
                <br />
                <span className='font-normal'>
                  The promo code you entered has expired.
                  <br />
                  Please check the code and try again.
                </span>
              </div>
            </div>
          )}
          {promoInfoSelected?.data === null && (
            <div className='mt-[10px] flex items-center text-justify text-sm'>
              <WarningTriangleIcon className='mr-2' size={24} />
              <div className='text-[#FD1212]'>
                <span>Invalid Promo Code</span>
                <br />
                <span className='font-normal'>
                  The promo code you entered is not valid. <br />
                  Please check the code and try again.
                </span>
              </div>
            </div>
          )}
        </Form.Item>
      )}
    </div>
  );
};
