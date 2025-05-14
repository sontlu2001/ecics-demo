'use client';

import { Modal, Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Addon, Option, ProposalPayload } from '@/libs/types/quote';
import EnhancedAccidentIcon from '@/components/icons/EnhancedAccidentIcon';
import KeyIcon from '@/components/icons/KeyIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PersonalAccidentIcon from '@/components/icons/PersonalAccidentIcon';
import RepairIcon from '@/components/icons/RepairIcon';
import RoadSideIcon from '@/components/icons/RoadSideIcon';
import { useGetQuote, useSaveProposal } from '@/hook/insurance/quote';
import AddOnBonusDetailManualForm from './bonus-personal-detail/AddOnBonusDetailManualForm';
import AddOnRowDetail from './AddOnRowDetail';
import { PricingSummary } from '../components/FeeBar';
import HeaderVehicleInfo from '../plan/components/HeaderVehicleInfo';
import { UserStep } from '@/libs/enums/processBarEnums';
import ModalPremium from './ModalPremium';

const mapIconToTypeAddOn = [
  {
    code: 'CAR_COM_ANW',
    icon: <KeyIcon className='text-brand-blue' />,
    isRecommended: true,
    title: 'Key Replacement Cover',
  },
  {
    code: 'CAR_COM_AJE',
    icon: <RepairIcon className='text-brand-blue' />,
    title: 'Repair at Any Workshop',
  },
  {
    code: 'CAR_COM_AND',
    icon: <RoadSideIcon className='text-brand-blue' />,
    title: '24/7 Road side assistance',
  },
  {
    code: 'CAR_COM_BUN',
    icon: <EnhancedAccidentIcon className='text-brand-blue' />,
    title: 'Enhanced Accident Coverage',
  },
  {
    code: 'CAR_COM_LOU',
    icon: <PersonalAccidentIcon className='text-brand-blue' />,
    title: 'Personal Accident +',
  },
  {
    code: 'CAR_COM_PAC',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
    title: 'New for Old Replacement',
  },
  {
    code: 'CAR_COM_MDE',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
    title: 'New for Old Replacement',
  },
  {
    code: 'CAR_COM_RSA',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
    title: 'New for Old Replacement',
  },
  {
    code: 'CAR_COM_KRC',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
    title: 'New for Old Replacement',
  },
  {
    code: 'CAR_COM_NOR',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
    title: 'New for Old Replacement',
  },
];

export interface AddOnFormat extends Addon {
  icon: JSX.Element | null;
  selectedOption: Option | null;
  feeAdded: number; // feeAdded is the fee used to calculate the premium for the addon

  activeOption: Option | null;
  feeSelected: number; // feeSelected is the fee used to show fee when user change option
}

function calculateFee(
  option: Option,
  addonsAdded: Record<string, string>,
): number {
  if (!option?.dependencies || option.dependencies.length === 0) {
    return option.premium_with_gst ?? 0;
  }
  const dependency = option.dependencies.find((dep) =>
    dep.conditions.every(
      (condition) => addonsAdded[condition.addon.code] === condition.value,
    ),
  );
  return dependency?.premium_with_gst ?? 0;
}

function AddOnDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [addonsAdded, setAddonsAdded] = useState<any>(null);
  const [addonsSelected, setAddonsSelected] = useState<any>(null);
  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);
  const [isShowBonusDetail, setIsShowBonusDetail] = useState(false);

  const { data: quoteInfo, isLoading } = useGetQuote(key);
  const { mutateAsync: saveProposal, isPending } = useSaveProposal();

  const plan = quoteInfo?.data?.plans?.find(
    (plan) => quoteInfo.data?.selected_plan === plan.title,
  );
  const addons = plan?.addons ?? [];
  const defaultAddonsAdded = useMemo(() => {
    if (!plan?.addons.length) return {};
    const addonCodes = plan.addons.map((addon) => addon.code);
    return Object.fromEntries(addonCodes.map((code) => [code, 'NO']));
  }, [plan]);

  const defaultAddonsSelected = useMemo(() => {
    if (!plan?.addons.length) return {};
    const selected_addons = quoteInfo?.data?.selected_addons ?? {};
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
  }, [plan]);

  useEffect(() => {
    // setDrivers(quoteInfo?.data?.add_named_driver_info ?? []);
    setAddonsAdded(defaultAddonsAdded);
    setAddonsSelected(defaultAddonsSelected);
  }, [defaultAddonsAdded, defaultAddonsSelected]);

  const addonsFormatted: AddOnFormat[] = addons.map((addon) => {
    // map the icon to the addon
    const iconMatched = mapIconToTypeAddOn.find(
      (item) => item.code === addon.code,
    );

    // For feeAdded use the "addonsAdded" defaults
    const initValueForAdded = addonsAdded?.[addon.code] ?? null;
    const selectedOptionForAdded = addon.options.find(
      (option) => option.value === initValueForAdded,
    );
    const feeAdded = selectedOptionForAdded
      ? calculateFee(selectedOptionForAdded, addonsAdded)
      : 0;

    // For feeSelected use the "addonsSelected" defaults
    const initValueForSelected = addonsSelected?.[addon.code] ?? null;
    const activeOption = addon.options.find(
      (option) => option.value === initValueForSelected,
    );
    const feeSelected = activeOption
      ? calculateFee(activeOption, addonsAdded)
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

  const dataSelectedAddOn = Object.entries(addonsAdded || {})
    .filter(([, selectedValue]) => selectedValue !== 'NO')
    .map(([code, selectedValue]) => {
      const addon = addonsFormatted.find((a) => a.code === code);
      const feeSelected = addon?.feeSelected || 0;
      return {
        title: addon?.title || code,
        feeSelected: feeSelected,
        selectedValue: selectedValue,
      };
    });

  const totalAdditionFee = addonsFormatted.reduce((acc, addon) => {
    const fee = addon.feeAdded ?? 0;
    return acc + fee;
  }, 0);
  const totalFee = totalAdditionFee + (plan?.premium_with_gst ?? 0);

  useEffect(() => {
    const addonsAdd: Record<string, string> = { ...addonsAdded };
    if (addonsAdd?.['CAR_COM_AJE'] === 'NO') {
      addonsAdd['CAR_COM_AJE'] = 'SGD 750.00';
    }
    if (addonsAdd?.['CAR_COM_AJE'] === 'YES') {
      addonsAdd['CAR_COM_AJE'] = 'SGD 1,500.00';
    }
    const data = {
      key: key,
      selected_plan: quoteInfo?.data?.selected_plan ?? '',
      selected_addons: addonsAdd,
      add_named_driver_info: drivers,
    };
    onSaveRegister(() => ({
      currentStep: UserStep.SELECT_ADD_ON,
      ...data,
    }));
  }, [addonsAdded]);

  const handleOkay = () => {
    const addonsAdd: Record<string, string> = { ...addonsAdded };
    //CAR_COM_AJE: "SGD 750.00" (CAR_COM_ANW: NO), or "SGD 1,500.00" (CAR_COM_ANW: YES):
    if (addonsAdd?.['CAR_COM_AJE'] === 'NO') {
      addonsAdd['CAR_COM_AJE'] = 'SGD 750.00';
    }
    if (addonsAdd?.['CAR_COM_AJE'] === 'YES') {
      addonsAdd['CAR_COM_AJE'] = 'SGD 1,500.00';
    }
    const data: ProposalPayload = {
      key: key,
      selected_plan: quoteInfo?.data?.selected_plan ?? '',
      selected_addons: addonsAdd,
      add_named_driver_info: drivers,
    };
    saveProposal(data).then(() => {
      setIsShowPopupPremium(false);
      setIsShowBonusDetail(true);
    });
  };

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <div className='max-w-[1280px]'>
        {isShowBonusDetail ? (
          <AddOnBonusDetailManualForm
            key={quoteInfo?.data.key}
            personal_info={quoteInfo?.data.personal_info}
            vehicle_info_selected={quoteInfo?.data.vehicle_info_selected}
          />
        ) : (
          <>
            <div className='mt-2 flex flex-col gap-4 px-4'>
              <div className='hidden items-center justify-between md:flex md:flex-col md:gap-4 xl:flex-row xl:gap-6'>
                <HeaderVehicleInfo
                  vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                  insuranceAdditionalInfo={
                    quoteInfo?.data.insurance_additional_info
                  }
                  selectPlan={quoteInfo?.data.selected_plan}
                  isShowScreen={true}
                />
              </div>
              <div className='mt-4 flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-3'>
                {addonsFormatted.map((addon) => (
                  <AddOnRowDetail
                    key={addon.code}
                    addon={addon}
                    addonsAdded={addonsAdded}
                    setAddonsAdded={setAddonsAdded}
                    addonsSelected={addonsSelected}
                    setAddonsSelected={setAddonsSelected}
                    drivers={drivers}
                    setDrivers={setDrivers}
                    policyStartDate={
                      quoteInfo?.data.insurance_additional_info?.start_date
                    }
                  />
                ))}
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
              isShowPopupPremium={isShowPopupPremium}
              setIsShowPopupPremium={setIsShowPopupPremium}
              quoteInfo={quoteInfo}
              totalFee={totalFee}
              addonsFormatted={addonsFormatted}
              dataSelectedAddOn={dataSelectedAddOn}
              handleOkay={handleOkay}
              isPending={isPending}
            />
          </>
        )}
      </div>
      {!isShowBonusDetail && (
        <div className='mt-20 w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-2'>
          <PricingSummary
            fee={totalFee}
            discount={quoteInfo?.promo_code?.discount || 0}
            title='Premium breakdown'
            textButton='Continue'
            onClick={() => setIsShowPopupPremium(true)}
          />
        </div>
      )}
    </div>
  );
}

export default AddOnDetail;
