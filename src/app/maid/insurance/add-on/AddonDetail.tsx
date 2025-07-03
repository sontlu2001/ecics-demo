'use client';

import { Modal } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { UserStep } from '@/libs/enums/processBarEnums';
import { MaidQuote } from '@/libs/types/maidQuote';
import { AddOnFormat } from '@/libs/types/quote';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { PlusIcon, RoadSideIcon } from '@/components/icons/add-on-icons';
import { PricingSummary } from '@/components/page/FeeBar';
import AddOnRow from '@/components/page/insurance/add-on/AddOnRow';
import AddOnRowDetail from '@/components/page/insurance/add-on/AddOnRowDetail';
import ModalPremium from '@/components/page/insurance/add-on/ModalPremium';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { useSaveQuote } from '@/hook/insurance/quote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

export const mapIconToTypeAddOn = [
  {
    code: 'MAID_CLASS_WOCI',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_DELU_WOCI',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_EXCLU_WOCI',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_CLASS_OME',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_DELU_OME',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_EXCLU_OME',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_CLASS_WOCP',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_DELU_WOCP',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
  {
    code: 'MAID_EXCLU_WOCP',
    icon: <PlusIcon className='text-brand-blue' size={20} />,
  },
];

function AddOnDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouterWithQuery();
  const { handleBack } = useInsurance();
  const dispatch = useAppDispatch();
  const key = searchParams.get('key') || '';
  const maidQuote = useAppSelector((state) => state.maidQuote?.maidQuote);

  const isManual = searchParams.get('manual') === 'true';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addonsAdded, setAddonsAdded] = useState<any>(null);
  const [addonsSelected, setAddonsSelected] = useState<any>(null);
  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);

  const { mutateAsync: saveQuote, isPending } = useSaveQuote();

  const plan = useMemo(() => {
    return maidQuote?.data?.plans?.find(
      (plan) => maidQuote.data?.selected_plan === plan.title,
    );
  }, [maidQuote]);

  const normalAddons = useMemo(() => {
    return plan?.addons ?? [];
  }, [plan]);

  const defaultAddonsAdded = useMemo(() => {
    if (!normalAddons.length) return {};
    const addonCodes = normalAddons.map((addon) => addon.code);
    return Object.fromEntries(
      addonCodes.map((code) => [
        code,
        maidQuote?.data?.selected_addons?.[code] ?? 'NO',
      ]),
    );
  }, [normalAddons, maidQuote]);

  const defaultAddonsSelected = useMemo(() => {
    if (!plan?.addons.length) return {};
    const selected_addons = maidQuote?.data?.selected_addons ?? {};
    return plan.addons.reduce(
      (acc: Record<string, string>, addon) => {
        if (addon.type === 'checkbox') {
          acc[addon.code] = 'YES';
        } else {
          const selectedValue = selected_addons?.[addon.code];
          if (selectedValue && selectedValue !== 'NO') {
            acc[addon.code] = selectedValue;
          } else {
            const defaultOption = addon.options.find(
              (option) => option.id === addon.default_option_id,
            );
            acc[addon.code] = defaultOption
              ? defaultOption.value
              : addon.options[0]?.value;
          }
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [plan, maidQuote]);

  useEffect(() => {
    setAddonsAdded(defaultAddonsAdded);
    setAddonsSelected(defaultAddonsSelected);
  }, [defaultAddonsAdded, defaultAddonsSelected]);

  const addonsFormatted: AddOnFormat[] = normalAddons.map((addon) => {
    // map the icon to the addon
    const iconMatched = mapIconToTypeAddOn.find(
      (item) => item.code === addon.code,
    );

    // For feeAdded use the "addonsAdded" defaults
    const initValueForAdded = addonsAdded?.[addon.code] ?? null;
    const selectedOptionForAdded = addon.options.find(
      (option) => option.value === initValueForAdded,
    );
    const feeAdded =
      addon.type === 'checkbox' && addonsAdded?.[addon.code] === 'YES'
        ? addon.premium_with_gst
        : addon.type === 'select'
          ? addon.options.find((opt) => opt.value === addonsAdded?.[addon.code])
              ?.premium_with_gst || 0
          : 0;

    // For feeSelected use the "addonsSelected" defaults
    const initValueForSelected = addonsSelected?.[addon.code] ?? null;
    const activeOption = addon.options.find(
      (option) => option.value === initValueForSelected,
    );

    const feeSelected =
      addon.type === 'checkbox' && addonsSelected?.[addon.code]
        ? addon.premium_with_gst
        : addon.type === 'select'
          ? addon.options.find(
              (opt) => opt.value === addonsSelected?.[addon.code],
            )?.premium_with_gst || 0
          : 0;

    return {
      ...addon,
      icon: iconMatched?.icon || null,
      selectedOption: selectedOptionForAdded ?? null,
      feeAdded: feeAdded,
      activeOption: activeOption ?? null,
      feeSelected: feeSelected,
    };
  });

  const dataSelectedAddOn = (
    Object.entries(addonsAdded || {}) as [string, string][]
  )
    .filter(([_, selectedValue]) => selectedValue.trim().toUpperCase() !== 'NO')
    .map(([code, selectedValue]) => {
      const addon = addonsFormatted.find((a) => a.code === code);
      const feeSelected = addon?.feeSelected || 0;
      const selectedOptionLabel = addon?.selectedOption?.label || '';

      return {
        title: addon?.title || code,
        feeSelected,
        selectedValue,
        optionLabel: selectedOptionLabel,
      };
    });

  useEffect(() => {
    const addonsAdd: Record<string, string> = { ...addonsAdded };

    const data = {
      key: key,
      selected_plan: maidQuote?.data?.selected_plan ?? '',
      selected_addons: addonsAdd,
    };
    onSaveRegister(() => ({
      currentStep: UserStep.SELECT_ADD_ON,
      ...data,
    }));
  }, [addonsAdded]);

  const totalAddonNormalFee = addonsFormatted.reduce((acc, addon) => {
    const fee = addon.feeAdded ?? 0;
    return acc + fee;
  }, 0);

  const totalAddonFee = totalAddonNormalFee;
  const premiumWithGst = plan?.premium_with_gst ?? 0;

  const discountRate = maidQuote?.promo_code?.discount || 0;
  const tax = 1.09;
  const pricePlanMain = premiumWithGst / (1 - discountRate / 100) / tax;
  const couponDiscount = pricePlanMain * (discountRate / 100);
  const selectAddOnTotal = dataSelectedAddOn.reduce((acc: any, addon: any) => {
    const value = addon.feeSelected || 0;
    return acc + value;
  }, 0);

  const netPremium = pricePlanMain - couponDiscount + selectAddOnTotal / tax;
  const valueCalculatedGST = 9;
  const gst = (netPremium * valueCalculatedGST) / 100;
  const totalFinalPrice = netPremium + gst;

  const handleOkay = () => {
    const addonsAdd: Record<string, string> = { ...addonsAdded };

    const data: any = {
      key: key,
      selected_addons: addonsAdd,
      review_info_premium: {
        price_plan: pricePlanMain,
        coupon_discount: couponDiscount,
        data_section_add_ons: dataSelectedAddOn,
        net_premium: netPremium,
        gst: gst,
        total_final_price: totalFinalPrice,
        add_ons_included_in_this_plan: plan?.add_ons_included_in_this_plan,
        total_addon_free: totalAddonFee,
      },
    };

    saveQuote({
      key: key,
      data: data,
      is_sending_email: false,
    }).then((res) => {
      dispatch(updateMaidQuote(res as Partial<MaidQuote>));
      setIsShowPopupPremium(false);
      if (isManual) {
        router.push(ROUTES.INSURANCE_MAID.HELPER_DETAIL);
      } else {
        router.push(ROUTES.INSURANCE_MAID.COMPLETE_PURCHASE);
      }
    });
  };

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='flex w-full max-w-[1280px] flex-col items-center justify-center md:mb-24'>
        <div className='mt-2 flex w-full flex-col gap-4 px-4'>
          <p className='mt-4 text-base font-bold underline'>Select Add-ons</p>
          <div className='flex flex-col items-center'>
            <div className='mt-4 flex w-full flex-col gap-6 lg:w-[950px] lg:gap-10'>
              {plan?.add_ons_included_in_this_plan?.map((addon) => (
                <AddOnRow
                  key={addon.add_on_id}
                  title={addon.add_on_name}
                  icon={<RoadSideIcon className='text-brand-blue' />}
                  status='completed'
                  isIncluded={true}
                  productType={ProductType.MAID}
                >
                  {addon.add_on_desc}
                </AddOnRow>
              ))}
              {addonsFormatted.map((addon) => {
                return (
                  <AddOnRowDetail
                    key={addon.code}
                    addon={addon}
                    addonsAdded={addonsAdded}
                    setAddonsAdded={setAddonsAdded}
                    addonsSelected={addonsSelected}
                    setAddonsSelected={setAddonsSelected}
                    isPending={isPending}
                    productType={ProductType.MAID}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <Modal
          title='Edit Information'
          open={isModalVisible}
          footer={[]}
          onCancel={() => setIsModalVisible(false)}
        >
          <p>Here you can edit the car info or insurance details.</p>
        </Modal>

        <ModalPremium
          productType={ProductType.MAID}
          isShowPopupPremium={isShowPopupPremium}
          setIsShowPopupPremium={setIsShowPopupPremium}
          maidQuote={maidQuote}
          dataSelectedAddOn={dataSelectedAddOn}
          pricePlanMain={pricePlanMain}
          couponDiscount={couponDiscount}
          tax={tax}
          gst={gst}
          netPremium={netPremium}
          addonsIncluded={plan?.add_ons_included_in_this_plan}
        />
      </div>
      <div className='mt-20 w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-2'>
        <PricingSummary
          productType={ProductType.MAID}
          planFee={premiumWithGst}
          addonFee={totalAddonFee}
          discount={maidQuote?.promo_code?.discount || 0}
          title='Premium breakdown'
          textButton='Next'
          onClick={handleOkay}
          handleBack={handleBack}
          setIsShowPopupPremium={setIsShowPopupPremium}
          loading={isPending}
        />
      </div>
    </div>
  );
}

export default AddOnDetail;
