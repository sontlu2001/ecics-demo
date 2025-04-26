import React from 'react';
import { Modal, Space, Drawer, Flex } from 'antd';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { PrimaryButton } from './ui/buttons';

export interface PremiumBreakdown {
  name: string;
  premium_b4_gst_b4_discount: number;
}

export interface PremiumBreakdownProps {
  selected_plan: PremiumBreakdown;
  selected_add_ons: PremiumBreakdown[];
  total_discount: number;
  total_gst: number;
  final_premium: number;
  visible: boolean;
  onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
  currencyDisplay: 'code',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Style
const scrollableContentClass = 'max-h-[80vh] overflow-y-auto';
const grayBoxClass =
  'w-full bg-gray-100 rounded-lg p-2 box-border border-gray-100';

const commonFontClass =
  'w-[calc(100%-6rem)] pb-1 font-normal text-sm leading-none';
const amountFontClass = 'w-24 text-left pb-1 font-normal text-sm leading-none';
const boldCommonFontClass =
  'w-[calc(100%-6rem)] pb-1 font-semibold text-sm leading-none';
const boldAmountFontClass =
  'w-24 text-left pb-1 font-semibold text-sm leading-none';
const blueCommonFontClass =
  'w-[calc(100%-6rem)] m-0 font-semibold text-sm leading-none text-brand-blue';
const blueAmountFontClass =
  'w-24 text-left m-0 font-semibold text-sm leading-none text-brand-blue';

export const PremiumBreakdownModal = ({
  selected_plan,
  selected_add_ons,
  total_discount = 0,
  total_gst,
  final_premium,
  visible,
  onClose,
}: PremiumBreakdownProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='mb-3 break-words text-base font-bold leading-none'>
        Premium Breakdown
      </div>

      <Space direction='vertical' className='mb-3 w-full'>
        {/* Plan detail */}
        <Space direction='vertical' className={grayBoxClass}>
          {/* Plan Premium */}
          <Flex className='w-full' justify='space-between'>
            <span className={commonFontClass}>{selected_plan.name}</span>
            <span className={amountFontClass}>
              {currencyFormatter.format(
                selected_plan.premium_b4_gst_b4_discount,
              )}
            </span>
          </Flex>

          {/* Discount if exist */}
          {total_discount != 0 && (
            <Flex className='w-full' justify='space-between'>
              <span className={blueCommonFontClass}>Coupon Discount</span>
              <span className='m-0 flex'>
                {/* to put minus mark */}
                <span className={blueCommonFontClass + ' pr-1'}>-</span>
                <span className={blueAmountFontClass}>
                  {currencyFormatter.format(total_discount)}
                </span>
              </span>
            </Flex>
          )}
        </Space>

        {/* Add-ons */}
        <Space direction='vertical' className={grayBoxClass}>
          <Flex justify='space-between' className='w-full'>
            <span className={boldCommonFontClass}>Add-on:</span>
          </Flex>

          {selected_add_ons.length > 0 ? (
            // if Add-on selected
            <>
              {selected_add_ons.map((addOn, idx) => (
                <Flex key={idx} justify='space-between' className='w-full'>
                  <span className={commonFontClass}>{addOn.name}</span>
                  <span className={amountFontClass}>
                    {addOn.premium_b4_gst_b4_discount
                      ? currencyFormatter.format(
                          addOn.premium_b4_gst_b4_discount,
                        )
                      : 'FREE'}
                  </span>
                </Flex>
              ))}
            </>
          ) : (
            // if there is not Add-on selected
            <Flex justify='space-between' className='w-full'>
              <span className={commonFontClass}>No add-ons in cart</span>
            </Flex>
          )}
        </Space>

        {/* GST and Net Premium */}
        <Space direction='vertical' className={grayBoxClass}>
          <Flex justify='space-between'>
            <span className={commonFontClass}>GST</span>
            <span className={amountFontClass}>
              {currencyFormatter.format(total_gst)}
            </span>
          </Flex>

          <Flex justify='space-between'>
            <span className={boldCommonFontClass}>Net Premium</span>
            <span className={boldAmountFontClass}>
              {currencyFormatter.format(final_premium)}
            </span>
          </Flex>
        </Space>
      </Space>

      <PrimaryButton onClick={onClose}>Okey</PrimaryButton>
    </>
  );

  // Return Drawer on mobile
  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onClose}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        <div className={scrollableContentClass}>{content}</div>
      </Drawer>
    );
  }

  // Return Modal on desktop
  return (
    <Modal
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      closable={true}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
    >
      <div className={scrollableContentClass}>{content}</div>
    </Modal>
  );
};
