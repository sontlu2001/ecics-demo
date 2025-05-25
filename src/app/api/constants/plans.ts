export const CAR_INSURANCE_PLANS = {
  COM: {
    ID: 'COM',
    TITLE: 'Comprehensive',
    PLAN_NAME: {
      COM: 'Comprehensive',
      TPFT: 'Third Party Fire & Theft',
      TPO: 'Third Party Only',
    },
  },
  TPFT: {
    id: 'TPFT',
    title: 'Third Party Fire and Theft',
    benefits: [
      {
        name: 'Up to SGD 10,000 Personal Accident Coverage',
        is_active: true,
      },
      {
        name: 'Third-Party liability coverage relating to vehicle charging',
        is_active: true,
      },
      {
        name: 'Free NCD Protector (from 10%) & Waiver of Excess',
        is_active: true,
      },
    ],
  },
  TPO: {
    id: 'TPO',
    title: 'Third Party Only',
    benefits: [
      {
        name: 'Up to SGD 10,000 Personal Accident Coverage',
        is_active: true,
      },
      {
        name: 'Third-Party liability coverage relating to vehicle charging',
        is_active: true,
      },
    ],
  },
};
