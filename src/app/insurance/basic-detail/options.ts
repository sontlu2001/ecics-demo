import { DropdownOption } from '@/components/ui/form/dropdownfield';

export const DEFAULT_PROMO_CODE = { code: 'ECICS5', desc: '15' };

export const DRV_EXP_OPTIONS: DropdownOption[] = [
  { value: 0, text: 'Less than 2 years' },
  { value: 2, text: '2 years' },
  { value: 3, text: '3 years' },
  { value: 4, text: '4 years' },
  { value: 5, text: '5 years' },
  { value: 6, text: '6 years and above' },
];

const generateYearOptions = (): DropdownOption[] => {
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

export const REG_YEAR_OPTIONS: DropdownOption[] = generateYearOptions();

export const NCD_OPTIONS: DropdownOption[] = [
  { value: 0, text: '0%' },
  { value: 10, text: '10%' },
  { value: 20, text: '20%' },
  { value: 30, text: '30%' },
  { value: 40, text: '40%' },
  { value: 50, text: '50%' },
];

export const NO_CLAIM_OPTIONS: DropdownOption[] = [
  { value: 0, text: '0' },
  { value: 1, text: '1' },
  { value: 2, text: '2 and above' },
];

export const CLAIM_AMOUNT_OPTIONS: DropdownOption[] = [
  { value: '<20000', text: 'less than SGD 20K' },
  { value: '>20000', text: 'more than SGD 20K' },
];

export const GENDER_OPTIONS: DropdownOption[] = [
  { value: 'MALE', text: 'Male' },
  { value: 'FEMALE', text: 'Female' },
];

export const MARITAL_STATUS_OPTIONS: DropdownOption[] = [
  { value: 'MARRIED', text: 'Married' },
  { value: 'SINGLE', text: 'Single' },
  { value: 'WIDOWED', text: 'Widowed' },
  { value: 'DIVORCED', text: 'Divorced' },
];
