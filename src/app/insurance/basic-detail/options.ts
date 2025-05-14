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

export const DEFAULT_PROMO_CODE = { code: 'ECICS5', desc: '15' };

export const DRV_EXP_OPTIONS: DropdownOption[] = [
  {
    value: NumberDriverExperience.LESS_THAN_2_YEARS,
    text: 'Less than 2 years',
  },
  { value: NumberDriverExperience.TWO_YEARS, text: '2 years' },
  { value: NumberDriverExperience.THREE_YEARS, text: '3 years' },
  { value: NumberDriverExperience.FOUR_YEARS, text: '4 years' },
  { value: NumberDriverExperience.FIVE_YEARS, text: '5 years' },
  { value: NumberDriverExperience.SIX_YEARS, text: '6 years and above' },
];

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
  { value: NumberClaim.ONE_CLAIM_LESS_THAN_10K, text: '1 claim ≤$10k' },
  { value: NumberClaim.ONE_CLAIM_LESS_THAN_20K, text: '1 claim ≤$20k' },
  { value: NumberClaim.TWO_CLAIM_LESS_THAN_10K, text: '2 claims ≤$10k' },
  { value: NumberClaim.TWO_CLAIM_LESS_THAN_20K, text: '2 claims ≤$20k' },
  {
    value: NumberClaim.TWO_MANY_CLAIMS,
    text: 'More than 2 claims or SGD20k',
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
