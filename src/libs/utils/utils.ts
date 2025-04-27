import { ECICS_USER_INFO } from '@/constants/general.constant';

export const removeItemsFromStorage = (
  keys: string[],
  storageType: 'local' | 'session',
) => {
  const storage = storageType === 'local' ? localStorage : sessionStorage;
  keys.forEach((key) => {
    storage.removeItem(key);
  });
};

export const removeAuthenticationInfoFromCache = () => {
  removeItemsFromStorage([ECICS_USER_INFO], 'session');
  removeItemsFromStorage([], 'local');
};

export const saveItemsToStorage = (
  items: Record<string, string>,
  storageType: 'local' | 'session',
) => {
  const storage = storageType === 'local' ? localStorage : sessionStorage;
  Object.entries(items).forEach(([key, value]) => {
    storage.setItem(key, value);
  });
};
