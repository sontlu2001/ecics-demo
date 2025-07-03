'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import NavigationConfirmModal from '@/providers/modal/NavigationConfirmModal';

function isPathAllowed(pathname: string) {
  return (
    pathname === `/${PRODUCT_NAME.MAID}` ||
    pathname.startsWith(`/${PRODUCT_NAME.MAID}/insurance/basic-detail`) ||
    pathname === `/${PRODUCT_NAME.MOTOR}` ||
    pathname.startsWith(`/${PRODUCT_NAME.MOTOR}/insurance/basic-detail`)
  );
}

export function NavigationConfirmProvider() {
  const router = useRouter();
  const pathName = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (isPathAllowed(pathName)) return;
    // Block the first back action.
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      setIsModalVisible(true);
      // Push the current state again to continue blocking.
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathName]);

  const handleLeave = () => {
    setIsModalVisible(false);

    const basePath = pathName.startsWith(`/${PRODUCT_NAME.MAID}`)
      ? `/${PRODUCT_NAME.MAID}`
      : pathName.startsWith(`/${PRODUCT_NAME.MOTOR}`)
        ? `/${PRODUCT_NAME.MOTOR}`
        : '/';

    router.push(basePath);
  };

  const handleStay = () => {
    setIsModalVisible(false);
    // Push a new history entry to intercept the next back button
    window.history.pushState(null, '', window.location.href);
  };

  return (
    <NavigationConfirmModal
      visible={isModalVisible}
      onLeave={handleLeave}
      onStay={handleStay}
    />
  );
}
