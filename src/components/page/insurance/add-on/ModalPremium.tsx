'use client';

import { Drawer, Modal } from 'antd';

import PremiumBreakdownContent, {
  PremiumBreakdownContentProps,
} from '@/components/PremiumBreakdownContent';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface Props extends PremiumBreakdownContentProps {
  isShowPopupPremium: boolean;
  setIsShowPopupPremium: (isShowPopupPremium: boolean) => void;
  productType?: ProductType;
}

const ModalPremium = (props: Props) => {
  const { isShowPopupPremium, setIsShowPopupPremium, productType, ...rest } =
    props;
  const isMobile = useDeviceDetection();

  const isMaid = productType === ProductType.MAID;
  const currentProductType = isMaid ? ProductType.MAID : ProductType.CAR;

  return (
    <>
      {isMobile.isMobile ? (
        <Drawer
          placement='bottom'
          open={isShowPopupPremium}
          onClose={() => setIsShowPopupPremium(false)}
          closable={false}
          height='auto'
          className='rounded-t-xl'
        >
          <PremiumBreakdownContent
            {...rest}
            productType={currentProductType}
            onClose={() => setIsShowPopupPremium(false)}
          />
        </Drawer>
      ) : (
        <Modal
          open={isShowPopupPremium}
          onCancel={() => setIsShowPopupPremium(false)}
          closable={false}
          maskClosable={true}
          keyboard={true}
          footer={null}
          width={385}
          centered
        >
          <PremiumBreakdownContent
            {...rest}
            productType={currentProductType}
            onClose={() => setIsShowPopupPremium(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default ModalPremium;
