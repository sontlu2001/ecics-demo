'use client';

import { Drawer, Modal } from 'antd';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

import { ProductType } from '../../basic-detail/options';

function SelfDeclarationConfirmModal({
  visible,
  onOk,
  onCancel,
  product_type,
}: {
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
  product_type: string;
}) {
  const { isMobile } = useDeviceDetection();

  const handleConfirmClick = () => {
    onOk();
  };

  const content = (
    <div className='flex flex-col justify-between'>
      <div>
        <p className='text-center text-base font-bold'>Self Declaration</p>
        <div className='mt-4 text-sm'>
          <ul className='list-disc pl-4 text-justify'>
            <li>
              You are a resident of Singapore possessing a valid FIN or NRIC;
            </li>
            <li>
              You have not been revoked or suspended driving license in the last
              3 years, or never been convicted of DUI (Driving Under the
              Influence) or DWI (Driving While Intoxicated);
            </li>
            <li>You are holding a valid Singapore driving license;</li>
            <li>Your car is not used for any rental purposes;</li>
            <li>Your car is in roadworthy condition within LTA guidelines;</li>
            <li>
              Your car is a private car used for the purpose of
              leisure/commuting only, and is not used to deliver goods or
              passengers as part of your job or in exchange for financial
              rewards;
            </li>
            <li>
              You have not had 3 or more claims made against your car insurance.
            </li>
          </ul>
          <div className='mt-[4px] text-justify font-semibold'>
            By proceeding, you acknowledge that you have read and meet all of
            the above eligibility criteria.
          </div>
        </div>
      </div>
      <div className='mt-6 flex justify-center'>
        <SecondaryButton
          onClick={onCancel}
          danger
          className='mr-[10px] w-full py-3 text-base font-semibold'
        >
          Back
        </SecondaryButton>
        <PrimaryButton
          onClick={handleConfirmClick}
          className='ml-[10px] w-full bg-[#34C759] py-3 text-base font-semibold text-white'
        >
          Confirm
        </PrimaryButton>
      </div>
    </div>
  );

  const contentMaid = (
    <div className='flex flex-col gap-6'>
      <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
        Declaration and Undertaking
      </p>
      <div
        className='flex max-h-[260px] flex-col gap-4 overflow-y-auto px-4'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <ol className='flex list-decimal flex-col gap-4 text-sm font-normal leading-[18px] text-[#969696]'>
          <li>
            In consideration of ECICS Limited (the “Insurer”) agreeing at my/our
            request to issue a Letter of Guarantee for the sum of Singapore
            Dollars Five Thousand Only (S$5,000) to the Ministry of Manpower,
            Singapore as security for the duty and satisfactory observance and
            performance of all conditionals under the Security Bond
          </li>
          <li>
            I/We hereby jointly and severally irrevocably and unconditionally
            agree and undertake for myself/ourselves and my/our heirs executors
            administrators assigns and successors that:
          </li>
          <li>
            1. As a continuing obligation I/we shall indemnify and keep
            indemnified the Insurer from and against all claims, demands,
            payment, actions, suits, proceedings, losses, expenses including
            legal costs on an indemnity basis and all other liabilities of
            whatsoever nature or description which may be made or taken against
            or incurred by the Insurer in relation to or arising out of the
            Security Bond and/or this Counter-Indemnity.
          </li>
          <li>
            2. Where any request is made upon the Insurer by the MOM for payment
            of any sum of money pursuant to the Security Bond (“such request”)
            the Insurer shall at its absolute discretion be at liberty to
            contest or compromise or immediately pay upon such request and such
            request shall be sufficient authority to the Insurer for making any
            payment thereon without requiring or obtaining any evidence or proof
            that the amount so claimed or requested is due and payable to the
            MOM and without any notice or reference to or further authority from
            me/us notwithstanding that I/we may dispute the validity of any such
            claim or request.
          </li>
          <li>
            3. I/We shall not at any time question or challenge the validity
            legality or otherwise of any payment made by the Insurer to the MOM
            pursuant to such request or deny any liability under this
            Counter-Indemnity on the ground that such payment or any part
            thereof made by the Insurer was not due or payable under the
            Security Bond or on any other ground whatsoever.
          </li>
          <li>
            4. I/We shall not be discharged or released from this
            Counter-Indemnity by any compromise, variation or arrangement made
            between the MOM and the Insurer in relation to the obligations
            undertaken by the Insurer under the Security Bond or by any
            forbearance whether as to payment, time, performance or otherwise
            given by the Controller to the Insurer.
          </li>
          <li>
            5. My/Our liability hereunder is irrevocable and shall remain in
            full force and effect until the Insurer’s liability under the
            Security Bond is fully discharged to the Insurer’s satisfaction.
          </li>
          <li>
            6. This Counter-Indemnity shall be governed by and construed in
            accordance with the laws of Singapore.
          </li>
          <li>
            7. I/We agreed that a copy of this letter of indemnity, either by
            way of fax or otherwise, shall be deemed binding and legally
            enforceable in a court of law and shall have the same legal effects
            as that of the original.
          </li>
        </ol>
      </div>
      <div className='flex flex-col gap-4'>
        <p className='text-sm font-semibold text-[#000000]'>
          By proceeding, you acknowledge that you have read and agree to the
          statements above.
        </p>
        <div className='flex flex-row justify-between'>
          <SecondaryButton
            onClick={onCancel}
            danger
            className='mr-[10px] w-full rounded-none py-3 text-base font-semibold'
          >
            Disagree
          </SecondaryButton>
          <PrimaryButton
            onClick={handleConfirmClick}
            className='ml-[10px] w-full bg-[#34C759] py-3 text-base font-semibold text-white'
          >
            Agree
          </PrimaryButton>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onCancel}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        {product_type === ProductType.MAID ? contentMaid : content}
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      closable={true}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
    >
      {product_type === ProductType.MAID ? contentMaid : content}
    </Modal>
  );
}

export default SelfDeclarationConfirmModal;
