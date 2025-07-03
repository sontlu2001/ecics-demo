'use client';

import { Button, Modal } from 'antd';

interface NavigationConfirmModalProps {
  visible: boolean;
  onLeave: () => void;
  onStay: () => void;
}

export default function NavigationConfirmModal({
  visible,
  onLeave,
  onStay,
}: NavigationConfirmModalProps) {
  return (
    <Modal
      open={visible}
      closable={false}
      mask={true}
      centered
      footer={
        <div className='grid grid-cols-2 gap-2'>
          <Button danger style={{ width: '100%' }} onClick={onLeave}>
            Leave
          </Button>
          <Button type='primary' style={{ width: '100%' }} onClick={onStay}>
            Stay
          </Button>
        </div>
      }
      bodyStyle={{
        paddingBottom: '24px',
      }}
    >
      <p className='text-lg font-semibold'>Do you want to leave this site?</p>
      <p className='text-base'>Changes you made may not be saved.</p>
    </Modal>
  );
}
