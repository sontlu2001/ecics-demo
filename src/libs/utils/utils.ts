import { v4 as uuid } from 'uuid';

import { DropdownOption } from '@/components/ui/form/dropdownfield';

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

export const generateYearOptions = (): DropdownOption[] => {
  const currentYear = new Date().getFullYear();
  const years: DropdownOption[] = [];

  for (let year = currentYear; year >= currentYear - 20; year--) {
    years.push({
      value: year.toString(),
      text: year.toString(),
    });
  }

  return years;
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

export const generateKeyAndAttachToUrl = (key: string) => {
  const generatedKey = key || uuid();
  const url = new URL(window.location.href);
  if (!key) {
    url.searchParams.set('key', generatedKey);
    window.history.replaceState({}, '', url.toString());
  }
  return generatedKey;
};

export const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const parsePhoneNumber = (raw: string) => {
  const cleaned = raw.replace(/\s+/g, '').trim(); // remove all spaces

  // Remove '+' if present
  let remaining = cleaned;
  let prefix = '';
  if (remaining.startsWith('+')) {
    prefix = '+';
    remaining = remaining.slice(1);
  }

  // Separate the region code (first 2 digits), the rest is nbr
  const areaCode = remaining.slice(0, 2);
  const nbr = remaining.slice(2);

  return { prefix, areaCode, nbr };
};

export const formatCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return '';
  }
  return `SGD ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPromoCode = (code: string | null): string => {
  return code ? code.trim().toUpperCase() : '';
};
