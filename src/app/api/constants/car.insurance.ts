export const CAR_INSURANCE = {
  TYPE: 'car',
  PLAN_CODE: {
    COM: 'COM',
    TPFT: 'TPFT',
    TPO: 'TPO',
  },
  PLAN_NAME: {
    COM: 'Comprehensive',
    TPFT: 'Third Party, Fire & Theft',
    TPO: 'Third Party Only',
  },

  ADD_ONS: {
    LOU: {
      YES: 'YES',
      NO: 'NO',
    },
    CC: {
      YES_UP_TO_1600CC: 'YES (up to 1,600cc)',
      YES_UP_TO_2000CC: 'YES (up to 2,000cc)',
      NO: 'NO',
    },
    ADDL_DRIVER: {
      YES: 'YES',
      NO: 'NO',
      DRIVERS_AGE_FROM_27_TO_70: 'drivers_age_from_27_to_70',
      ALL_DRIVERS: 'all_drivers',
    },
  },

  CODE_ADDL_DRIVERS: ['CAR_COM_AND', 'CAR_TPFT_AND', 'CAR_TPO_AND'],

  CODE_LOUS: ['CAR_COM_LOU'],
};

export const PLAN_ADDON_CONFIG = {
  [CAR_INSURANCE.PLAN_NAME.COM]: {
    andKey: 'CAR_COM_AND',
    louKey: 'CAR_COM_LOU',
    applyLouAndCc: true,
    setDefaults: false,
  },
  [CAR_INSURANCE.PLAN_NAME.TPFT]: {
    andKey: 'CAR_TPFT_AND',
    louKey: 'CAR_TPFT_LOU',
    applyLouAndCc: true,
    setDefaults: true,
  },
  [CAR_INSURANCE.PLAN_NAME.TPO]: {
    andKey: 'CAR_TPO_AND',
    louKey: 'CAR_TPO_LOU',
    applyLouAndCc: true,
    setDefaults: true,
  },
};
