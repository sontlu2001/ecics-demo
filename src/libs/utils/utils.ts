import { ECICS_USER_INFO } from '@/constants/general.constant';

export const removeFromLocalStorage = (keys: string[]) => {
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const removeFromSessionStorage = (keys: string[]) => {
  keys.forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

export const removeAuthenticationInfoFromCache = (
  storageType: 'local' | 'session',
) => {
  if (storageType === 'session') {
    removeFromSessionStorage([ECICS_USER_INFO]);
  } else if (storageType === 'local') {
    removeFromLocalStorage([]);
  }
};

export const saveToLocalStorage = (items: Record<string, string>) => {
  Object.entries(items).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};

export const saveToSessionStorage = (items: Record<string, string>) => {
  Object.entries(items).forEach(([key, value]) => {
    sessionStorage.setItem(key, value);
  });
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
