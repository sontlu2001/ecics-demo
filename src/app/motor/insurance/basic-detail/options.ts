import { DropdownOption } from '@/components/ui/form/dropdownfield';

export enum ProductType {
  MAID = 'maid',
  CAR = 'car',
  EVCAR = 'ev_car',
}

export enum NumberClaim {
  NEVER = '0',
  ONE_CLAIM_LESS_THAN_10K = '1 claim ≤$10k',
  ONE_CLAIM_LESS_THAN_20K = '1 claim ≤$20k',
  TWO_CLAIM_LESS_THAN_10K = '2 claims ≤$10k',
  TWO_CLAIM_LESS_THAN_20K = '2 claims ≤$20k',
  TWO_MANY_CLAIMS = 'to_many_claims',
}
export enum NumberDriverExperience {
  LESS_THAN_2_YEARS = 2,
  // TWO_YEARS = '2 years',
  // THREE_YEARS = '3 years',
  // FOUR_YEARS = '4 years',
  // FIVE_YEARS = '5 years',
  // SIX_YEARS = '6 years and above',
}

export enum GenderValue {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum MaritalStatusValue {
  MARRIED = 'MARRIED',
  SINGLE = 'SINGLE',
  WIDOWED = 'WIDOWED',
  DIVORCED = 'DIVORCED',
}

export enum HelperTypeValue {
  NEW_MAID = 'New Maid',
  RENEWAL_MAID = 'Renewal Maid',
  TRANSFER_MAID = 'Transfer Maid',
}

export enum PolicyDurationValue {
  TWENTY_SIX = '26',
  FOURTEEN = '14',
}

export enum HasHelperValue {
  YES = 'YES',
  NO = 'NO',
}

// const DRIVER_EXP_BASE = [
//   {
//     valueEnum: NumberDriverExperience.LESS_THAN_2_YEARS,
//     valueNumber: 0,
//     text: 'Less than 2 years',
//   },
//   {
//     valueEnum: NumberDriverExperience.TWO_YEARS,
//     valueNumber: 2,
//     text: '2 years',
//   },
//   {
//     valueEnum: NumberDriverExperience.THREE_YEARS,
//     valueNumber: 3,
//     text: '3 years',
//   },
//   {
//     valueEnum: NumberDriverExperience.FOUR_YEARS,
//     valueNumber: 4,
//     text: '4 years',
//   },
//   {
//     valueEnum: NumberDriverExperience.FIVE_YEARS,
//     valueNumber: 5,
//     text: '5 years',
//   },
//   {
//     valueEnum: NumberDriverExperience.SIX_YEARS,
//     valueNumber: 6,
//     text: '6 years and above',
//   },
// ];

// export const DRV_EXP_OPTIONS: DropdownOption[] = DRIVER_EXP_BASE.map(
//   (item) => ({
//     value: item.valueEnum,
//     text: item.text,
//   }),
// );

// export const DRIVE_EXP_OPTIONS: DropdownOption[] = DRIVER_EXP_BASE.map(
//   (item) => ({
//     value: item.valueNumber,
//     text: item.text,
//   }),
// );

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
  { value: GenderValue.MALE, text: 'Male' },
  { value: GenderValue.FEMALE, text: 'Female' },
];

export const MARITAL_STATUS_OPTIONS: DropdownOption[] = [
  { value: MaritalStatusValue.MARRIED, text: 'Married' },
  { value: MaritalStatusValue.SINGLE, text: 'Single' },
  { value: MaritalStatusValue.WIDOWED, text: 'Widowed' },
  { value: MaritalStatusValue.DIVORCED, text: 'Divorced' },
];

export const HELPER_TYPE_OPTIONS: DropdownOption[] = [
  { value: HelperTypeValue.NEW_MAID, text: 'New Maid' },
  { value: HelperTypeValue.RENEWAL_MAID, text: 'Renewal Maid' },
  { value: HelperTypeValue.TRANSFER_MAID, text: 'Transfer Maid' },
];

export const POLICY_DURATION_OPTIONS: DropdownOption[] = [
  { value: PolicyDurationValue.TWENTY_SIX, text: '26 Months' },
  { value: PolicyDurationValue.FOURTEEN, text: '14 Months' },
];

export const HAS_HELPER_WORKED_OPTION: DropdownOption[] = [
  { value: HasHelperValue.YES, text: 'Yes' },
  { value: HasHelperValue.NO, text: 'No' },
];
