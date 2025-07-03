import { Button } from 'antd';

import { MaidQuote } from '@/libs/types/maidQuote';
import { Addon, AddOnIncludedInPlan, Quote } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';

export interface PremiumBreakdownContentProps {
  quoteInfo?: Quote;
  maidQuote?: MaidQuote;
  dataSelectedAddOn: any;
  drivers?: any[];
  addonAdditionalDriver?: Addon;
  pricePlanMain: number;
  couponDiscount: number;
  tax: number;
  gst: number;
  netPremium: number;
  addonsIncluded?: AddOnIncludedInPlan[];
  onClose?: () => void;
  isSummaryScreen?: boolean;
  productType?: ProductType;
}

const PremiumBreakdownContent = ({
  quoteInfo,
  dataSelectedAddOn,
  maidQuote,
  drivers,
  addonAdditionalDriver,
  pricePlanMain,
  couponDiscount,
  tax,
  gst,
  netPremium,
  addonsIncluded,
  onClose,
  isSummaryScreen,
  productType,
}: PremiumBreakdownContentProps) => {
  const hasAddons = dataSelectedAddOn && dataSelectedAddOn.length > 0;
  const hasDrivers = drivers && drivers.length > 0;
  const hasIncludedAddOns = addonsIncluded && addonsIncluded.length > 0;
  const hasAnyContent = hasAddons || hasDrivers || hasIncludedAddOns;

  const isMaid = productType === ProductType.MAID;
  const currentQuote = isMaid ? maidQuote : quoteInfo;

  return (
    <div className='flex flex-col gap-4 overflow-y-auto'>
      <p
        className={`sticky top-0 z-10 bg-white pb-2 pt-2 font-semibold leading-[30px] text-[#171A1F] ${isSummaryScreen ? 'text-base underline' : 'text-xl'}`}
      >
        Premium Breakdown
      </p>
      <div className='flex max-h-[70vh] flex-col gap-4 overflow-y-auto'>
        {/* Plan */}
        <div className='flex flex-col gap-2'>
          <p className='text-base font-bold text-[#303030]'>Plan</p>
          <div className='flex flex-row justify-between text-sm font-normal text-[#303030]'>
            <p>{currentQuote?.data?.selected_plan ?? ''}</p>
            <p>{formatCurrency(pricePlanMain)}</p>
          </div>
          {currentQuote?.promo_code && (
            <div className='flex flex-row justify-between text-sm font-semibold text-[#00ADEF]'>
              <p>Coupon Discount</p>
              <p>-{formatCurrency(couponDiscount)}</p>
            </div>
          )}
        </div>

        {hasAnyContent && (
          <div className='flex flex-col gap-2 rounded-lg py-2 text-sm font-semibold text-[#303030]'>
            {/* Add-ons */}
            <p className='text-base font-bold text-[#303030]'>Add-on:</p>
            <div>
              <div className='flex flex-col gap-3'>
                {dataSelectedAddOn?.map((addon: any) => (
                  <p
                    key={addon.title}
                    className='flex flex-row items-center justify-between gap-10 font-normal text-[#303030]'
                  >
                    <p className='flex flex-col'>
                      {addon.title}
                      {addon.optionLabel && addon.optionLabel !== 'YES' && (
                        <span className='ml-2 flex flex-row items-center gap-2'>
                          <p className='h-[4px] w-[4px] rounded-full bg-[#303030]'></p>
                          {addon.optionLabel} Coverage
                        </span>
                      )}
                    </p>
                    <span>{formatCurrency(addon.feeSelected / tax)}</span>
                  </p>
                ))}
              </div>

              {/* Drivers */}
              {hasDrivers && (
                <div className='mt-4'>
                  <p className='text-sm font-semibold text-[#303030]'>
                    Additional Named Driver(s)
                  </p>
                  {drivers.map((driver, index) => (
                    <div
                      key={index}
                      className='flex flex-row items-center justify-between font-normal text-[#303030]'
                    >
                      <div className='flex items-center gap-2'>
                        <div className='h-[4px] w-[4px] rounded-full bg-[#303030]'></div>
                        <p className='max-w-[220px] break-words text-justify'>
                          {driver.name}
                        </p>
                      </div>
                      <p>
                        {index === 0
                          ? 'FREE'
                          : addonAdditionalDriver?.options?.[0]
                                ?.premium_with_gst
                            ? formatCurrency(
                                addonAdditionalDriver.options[0]
                                  .premium_with_gst / 1.09,
                              )
                            : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add-ons included in plan */}
              {hasIncludedAddOns && (
                <div className='mt-4 flex flex-col gap-2'>
                  {addonsIncluded.map((item, index) => (
                    <div key={index} className='flex flex-row justify-between'>
                      <span>{item.add_on_name}</span>
                      <span>INCLUDED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className='flex flex-col gap-1 rounded-lg py-2'>
          <div className='flex flex-row justify-between text-base font-bold text-[#303030]'>
            <p>Sub-Total</p>
            <p>{formatCurrency(netPremium)}</p>
          </div>
          <div className='flex flex-row justify-between text-base font-normal text-[#303030]'>
            <p>GST</p>
            <p>{formatCurrency(gst)}</p>
          </div>
          <div className='flex flex-row justify-between text-base font-bold text-[#303030]'>
            <p>Total Premium</p>
            <p>{formatCurrency(netPremium + gst)}</p>
          </div>
        </div>
      </div>
      {!isSummaryScreen && (
        <div className='sticky bottom-0 z-10 bg-white pt-2'>
          <Button
            className='w-full rounded-none border border-[#00ADEF] bg-white py-6 text-center text-base font-bold !text-[#00ADEF]'
            onClick={onClose}
          >
            Close Breakdown
          </Button>
        </div>
      )}
    </div>
  );
};

export default PremiumBreakdownContent;
