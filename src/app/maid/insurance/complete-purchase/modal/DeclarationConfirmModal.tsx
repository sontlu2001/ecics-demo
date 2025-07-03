'use client';

import { Drawer, Modal } from 'antd';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

function DeclarationConfirmModal({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
}) {
  const { isMobile } = useDeviceDetection();

  const handleConfirmClick = () => {
    onOk();
  };

  const content = (
    <div className='flex flex-col gap-6'>
      <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
        Declaration and Undertaking
      </p>
      <div className='flex max-h-[60vh] flex-col gap-2 overflow-y-auto bg-[#F4FBFD] px-2 text-justify text-sm text-[#000000]'>
        <p>
          <strong>DECLARATION</strong>
        </p>
        <p>I hereby declare and agree that:</p>
        <ol className='list-decimal space-y-2 pl-6 text-sm text-[#000000]'>
          <li>
            the statements herein are true, accurate and complete; otherwise the
            policy issued may be void. ECICS Limited is authorized to make any
            inquiry in connection with this application. Neither the acceptance
            of this application nor the making of any further inquiry will bind
            ECICS Limited to complete the insurance.
          </li>
          <li>
            the information contained in and submitted with this application is
            on file with ECICS Limited and along with the application is
            considered physically attached to the Policy and will become part of
            it. ECICS Limited has relied upon this application and attachments
            in issuing this Policy. I/We agree that the information contained in
            and submitted with this application is deemed material to the risk
            assumed by ECICS Limited.
          </li>
          <li>
            if the information in this application materially changes between
            the date this application is signed and prior to the inception date
            of the Policy, the proposer will notify ECICS Limited, who may
            modify or withdraw the quotation and/or revise the terms of the
            Policy.
          </li>
          <li>
            the insured maid is in good health and free from physical defects,
            infirmity or illness or recurring illness.
          </li>
          <li>
            agree to ensure that the insured maid meets the vaccination required
            by the Singapore government at all times.
          </li>
          <li>
            understand that all pre-existing conditions are not covered for the
            first 12 months of the maid’s employment with me. Thereafter,
            pre-existing conditions are covered under Section 3 of our policy
            subject to the terms and conditions of the policy.
          </li>
          <li>
            understand that I am liable to co-pay the eligible claims amount
            above $15,000 unless I have opted to purchase the Waiver of
            Co-payment Payable by Employer optional cover during the application
            of this policy.
          </li>
          <li>
            I have read and understand the terms, conditions and exclusions
            contained in the policy and as modified or extended.
          </li>
          <li>
            I understand that any guarantee issued by ECICS Limited pursuant to
            the policy is subject to the Counter Indemnity as attached and I
            agree to the terms and conditions therein.
          </li>
          <li>
            I/We have read and consent to the Consent for Use & Disclosure of
            Personal Data. Please refer to the full ECICS Limited’s Consent for
            Use & Disclosure of Personal Data at{' '}
            <a
              href='https://www.ecics.com/personal-data'
              target='_blank'
              rel='noopener noreferrer'
            >
              https://www.ecics.com/personal-data
            </a>{' '}
            for more information.
          </li>
        </ol>
        <p>
          <strong>
            COUNTER INDEMNITY (in respect of Security Bond issued to MOM of
            Singapore)
          </strong>
        </p>
        <p>
          <strong>IMPORTANT NOTICE</strong> - The Proposer/Employer is hereby
          notified that by virtue of signing this letter of indemnity, it is
          hereby understood and agreed that a copy of it, either by way of fax
          or otherwise, shall be deemed binding and legally enforceable in a
          court of law and shall have the same legal effects as that of the
          original.
        </p>
        <p>
          To: ECICS Limited, 10 Eunos Road 8, Singapore Post Centre #09-04A,
          Singapore 408600
        </p>
        <p>
          In consideration of ECICS Limited (the “Insurer”) agreeing at my/our
          request to issue a Letter of Guarantee for the sum of Singapore
          Dollars Five Thousand Only (S$5,000) to the Ministry of Manpower,
          Singapore as security for the duty and satisfactory observance and
          performance of all conditionals under the Security Bond.
        </p>
        <p>
          I/We hereby jointly and severally irrevocably and unconditionally
          agree and undertake for myself/ourselves and my/our heirs executors
          administrators assigns and successors that:
        </p>
        <ol className='list-decimal space-y-2 pl-6 text-sm text-[#000000]'>
          <li>
            As a continuing obligation I/we shall indemnify and keep indemnified
            the Insurer from and against all claims, demands, payment, actions,
            suits, proceedings, losses, expenses including legal costs on an
            indemnity basis and all other liabilities of whatsoever nature or
            description which may be made or taken against or incurred by the
            Insurer in relation to or arising out of the Security Bond and/or
            this Counter-Indemnity.
          </li>
          <li>
            Where any request is made upon the Insurer by the MOM for payment of
            any sum of money pursuant to the Security Bond (“such request”) the
            Insurer shall at its absolute discretion be at liberty to contest or
            compromise or immediately pay upon such request and such request
            shall be sufficient authority to the Insurer for making any payment
            thereon without requiring or obtaining any evidence or proof that
            the amount so claimed or requested is due and payable to the MOM and
            without any notice or reference to or further authority from me/us
            notwithstanding that I/we may dispute the validity of any such claim
            or request.
          </li>
          <li>
            I/We shall not at any time question or challenge the validity
            legality or otherwise of any payment made by the Insurer to the MOM
            pursuant to such request or deny any liability under this
            Counter-Indemnity on the ground that such payment or any part
            thereof made by the Insurer was not due or payable under the
            Security Bond or on any other ground whatsoever.
          </li>
          <li>
            I/We shall not be discharged or released from this Counter-Indemnity
            by any compromise, variation or arrangement made between the MOM and
            the Insurer in relation to the obligations undertaken by the Insurer
            under the Security Bond or by any forbearance whether as to payment,
            time, performance or otherwise given by the Controller to the
            Insurer.
          </li>
          <li>
            My/Our liability hereunder is irrevocable and shall remain in full
            force and effect until the Insurer’s liability under the Security
            Bond is fully discharged to the Insurer’s satisfaction.
          </li>
          <li>
            This Counter-Indemnity shall be governed by and construed in
            accordance with the laws of Singapore.
          </li>
          <li>
            I/We agreed that a copy of this letter of indemnity, either by way
            of fax or otherwise, shall be deemed binding and legally enforceable
            in a court of law and shall have the same legal effects as that of
            the original.
          </li>
        </ol>
      </div>
      <div className='flex flex-col gap-4'>
        <p className='text-justify text-sm font-semibold text-[#000000]'>
          By agreeing, you acknowledge that you have read and agree to the
          Declaration and Counter Indemnity applicable to Online Payment.
        </p>
        <div className='flex flex-row justify-between'>
          <SecondaryButton
            onClick={onCancel}
            danger
            className='mr-[10px] w-[150px] rounded-none py-3 text-left text-base font-semibold'
          >
            Disagree
          </SecondaryButton>
          <PrimaryButton
            onClick={handleConfirmClick}
            className='ml-[10px] w-[150px] bg-[#34C759] py-3 text-end text-base font-semibold text-white'
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
        {content}
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
      width={710}
    >
      {content}
    </Modal>
  );
}

export default DeclarationConfirmModal;
