import { DropdownOption } from '@/components/ui/form/dropdownfield';

export enum NumberClaim {
  NEVER = '0',
  ONE_CLAIM_LESS_THAN_10K = '1 claim ≤$10k',
  ONE_CLAIM_LESS_THAN_20K = '1 claim ≤$20k',
  TWO_CLAIM_LESS_THAN_10K = '2 claims ≤$10k',
  TWO_CLAIM_LESS_THAN_20K = '2 claims ≤$20k',
  TWO_MANY_CLAIMS = 'to_many_claims',
}
export enum NumberDriverExperience {
  LESS_THAN_2_YEARS = 'less_than_2_years',
  TWO_YEARS = '2 years',
  THREE_YEARS = '3 years',
  FOUR_YEARS = '4 years',
  FIVE_YEARS = '5 years',
  SIX_YEARS = '6 years and above',
}

const DRIVER_EXP_BASE = [
  {
    valueEnum: NumberDriverExperience.LESS_THAN_2_YEARS,
    valueNumber: 0,
    text: 'Less than 2 years',
  },
  {
    valueEnum: NumberDriverExperience.TWO_YEARS,
    valueNumber: 2,
    text: '2 years',
  },
  {
    valueEnum: NumberDriverExperience.THREE_YEARS,
    valueNumber: 3,
    text: '3 years',
  },
  {
    valueEnum: NumberDriverExperience.FOUR_YEARS,
    valueNumber: 4,
    text: '4 years',
  },
  {
    valueEnum: NumberDriverExperience.FIVE_YEARS,
    valueNumber: 5,
    text: '5 years',
  },
  {
    valueEnum: NumberDriverExperience.SIX_YEARS,
    valueNumber: 6,
    text: '6 years and above',
  },
];

export const DRV_EXP_OPTIONS: DropdownOption[] = DRIVER_EXP_BASE.map(
  (item) => ({
    value: item.valueEnum,
    text: item.text,
  }),
);

export const DRIVE_EXP_OPTIONS: DropdownOption[] = DRIVER_EXP_BASE.map(
  (item) => ({
    value: item.valueNumber,
    text: item.text,
  }),
);

const generateYearOptions = (): DropdownOption[] => {
  const currentYear = new Date().getFullYear();
  const years: DropdownOption[] = [];

  for (let year = currentYear; year >= currentYear - 15; year--) {
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
  { value: NumberClaim.NEVER, text: '0' },
  { value: NumberClaim.ONE_CLAIM_LESS_THAN_10K, text: '1 claim ≤ SGD 10k' },
  { value: NumberClaim.ONE_CLAIM_LESS_THAN_20K, text: '1 claim ≤ SGD 20k' },
  { value: NumberClaim.TWO_CLAIM_LESS_THAN_10K, text: '2 claims ≤ SGD 10k' },
  { value: NumberClaim.TWO_CLAIM_LESS_THAN_20K, text: '2 claims ≤ SGD 20k' },
  {
    value: NumberClaim.TWO_MANY_CLAIMS,
    text: 'More than 2 claims or SGD 20k',
  },
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
