export const ROUTES = {
  INSURANCE: {
    BASIC_DETAIL: '/motor/insurance/basic-detail',
    BASIC_DETAIL_SINGPASS: '/motor/insurance/basic-detail?manual=false',
    BASIC_DETAIL_MANUAL: '/motor/insurance/basic-detail?manual=true',
    PLAN: '/motor/insurance/plan',
    ADD_ON: '/motor/insurance/add-on',
    PERSONAL_DETAIL: '/motor/insurance/personal-detail',
    COMPLETE_PURCHASE: '/motor/insurance/complete-purchase',
  },
  MOTOR: {
    LOGIN: '/motor',
    REVIEW_INFO_DETAIL: '/motor/review-info-detail',
  },
};

export const STEP_TO_ROUTE: Record<number, string> = {
  0: ROUTES.MOTOR.REVIEW_INFO_DETAIL,
  1: ROUTES.INSURANCE.BASIC_DETAIL,
  2: ROUTES.INSURANCE.PLAN,
  3: ROUTES.INSURANCE.ADD_ON,
  4: ROUTES.INSURANCE.PERSONAL_DETAIL,
  5: ROUTES.INSURANCE.COMPLETE_PURCHASE,
};
