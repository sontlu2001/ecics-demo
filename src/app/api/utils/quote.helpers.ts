import { ADD_ON_VALUES, CAR_INSURANCE } from '../constants/car.insurance';

export function mappedPlanPremiums(quoteData: any): Record<string, number> {
  return {
    COM: quoteData?.comp_plan?.plan_premium_with_gst ?? 0,
    TPFT: quoteData?.tpft_plan?.plan_premium_with_gst ?? 0,
    TPO: quoteData?.tpo_plan?.plan_premium_with_gst ?? 0,
    FNCD: quoteData?.comp_fncd_plan?.plan_premium_with_gst ?? 0,
  };
}

export function mappedAddonPremiums(quoteData: any): Record<string, number> {
  return {
    workshop_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_any_workshop
        ?.any_workshop_if_selected ?? 0,
    buy_up_ncd_if_any_workshop_not_selected:
      quoteData?.comp_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.addl_prem_for_buy_up_ncd_if_any_workshop_not_selected ?? 0,
    buy_up_ncd_if_any_workshop_selected:
      quoteData?.comp_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.addl_prem_for_buy_up_ncd_if_any_workshop_selected ?? 0,
    transport_allowance_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_loss_of_use
        ?.transport_allowance_if_selected ?? 0,
    courtesy_car_up_to_1600cc_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_loss_of_use
        ?.courtesy_car_up_to_1600cc_if_selected ?? 0,
    courtesy_car_up_to_2000cc_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_loss_of_use
        ?.courtesy_car_up_to_2000cc_if_selected ?? 0,
    personal_accident_plus_30K_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_personal_accident_plus?.[
        '(+ $30K)_if_selected'
      ] ?? 0,
    personal_accident_plus_60K_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_personal_accident_plus?.[
        '(+ $60K)_if_selected'
      ] ?? 0,
    personal_accident_plus_100K_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_personal_accident_plus?.[
        '(+ $100K)_if_selected'
      ] ?? 0,
    medical_expenses_200_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_medical_expenses?.[
        '(+ $200)_if_selected'
      ] ?? 0,
    medical_expenses_700_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_medical_expenses?.[
        '(+ $700)_if_selected'
      ] ?? 0,
    medical_expenses_1700_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_medical_expenses?.[
        '(+ $1700)_if_selected'
      ] ?? 0,
    roadside_assistance_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_roadside_assistance
        ?.if_selected ?? 0,
    key_replacement_cover_300_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_key_replacement_cover?.[
        '($300)_if_selected'
      ] ?? 0,
    key_replacement_cover_500_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_key_replacement_cover?.[
        '($500)_if_selected'
      ] ?? 0,
    new_for_old_replacement_if_selected:
      quoteData?.comp_plan?.add_ons?.nfr?.addl_prem_for_new_for_old_replacement
        ?.if_selected ?? 0,
    tpft_drivers_age_from_27_to_70_if_selected:
      quoteData?.tpft_plan?.addl_named_drivers_premium ?? 0,
    tpft_all_drivers_if_selected:
      quoteData?.tpft_plan?.add_ons?.addl_named_drivers_premium
        ?.all_drivers_if_selected ?? 0,
    tpft_buy_up_ncd_if_selected:
      quoteData?.tpft_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.buy_up_ncd_if_selected ?? 0,
    tpo_drivers_age_from_27_to_70_if_selected:
      quoteData?.tpo_plan?.addl_named_drivers_premium ?? 0,
    tpo_all_drivers_if_selected:
      quoteData?.tpo_plan?.add_ons?.addl_named_drivers_premium
        ?.all_drivers_if_selected ?? 0,
    tpo_buy_up_ncd_if_selected:
      quoteData?.tpo_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.buy_up_ncd_if_selected ?? 0,
    com_adjustable_excess_selected: quoteData?.comp_plan?.standard_excess ?? 0,
    com_additional_name_driver_if_selected:
      quoteData?.comp_plan?.addl_named_drivers_premium ?? 0,
    fncd_workshop_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_any_workshop
        ?.any_workshop_if_selected ?? 0,
    fncd_adjustable_excess_selected:
      quoteData?.comp_fncd_plan?.standard_excess ?? 0,
    fncd_additional_name_driver_if_selected:
      quoteData?.comp_fncd_plan?.addl_named_drivers_premium ?? 0,
    fncd_buy_up_ncd_if_any_workshop_not_selected:
      quoteData?.comp_fncd_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.addl_prem_for_buy_up_ncd_if_any_workshop_not_selected ?? 0,
    fncd_buy_up_ncd_if_any_workshop_selected:
      quoteData?.comp_fncd_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.addl_prem_for_buy_up_ncd_if_any_workshop_selected ?? 0,
    fncd_transport_allowance_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_loss_of_use
        ?.transport_allowance_if_selected ?? 0,
    fncd_courtesy_car_up_to_1600cc_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_loss_of_use
        ?.courtesy_car_up_to_1600cc_if_selected ?? 0,
    fncd_courtesy_car_up_to_2000cc_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_loss_of_use
        ?.courtesy_car_up_to_2000cc_if_selected ?? 0,
    fncd_personal_accident_plus_30K_if_selected:
      quoteData?.comp_fncd_plan?.add_ons
        ?.addl_prem_for_personal_accident_plus?.['(+ $30K)_if_selected'] ?? 0,
    fncd_personal_accident_plus_60K_if_selected:
      quoteData?.comp_fncd_plan?.add_ons
        ?.addl_prem_for_personal_accident_plus?.['(+ $60K)_if_selected'] ?? 0,
    fncd_personal_accident_plus_100K_if_selected:
      quoteData?.comp_fncd_plan?.add_ons
        ?.addl_prem_for_personal_accident_plus?.['(+ $100K)_if_selected'] ?? 0,
    fncd_roadside_assistance_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_roadside_assistance
        ?.if_selected ?? 0,
    fncd_key_replacement_cover_300_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_key_replacement_cover?.[
        '($300)_if_selected'
      ] ?? 0,
    fncd_key_replacement_cover_500_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_key_replacement_cover?.[
        '($500)_if_selected'
      ] ?? 0,
    fncd_new_for_old_replacement_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.nfr
        ?.addl_prem_for_new_for_old_replacement?.if_selected ?? 0,
    fncd_medical_expenses_1700_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_medical_expenses?.[
        '(+ $1700)_if_selected'
      ] ?? 0,
    fncd_medical_expenses_700_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_medical_expenses?.[
        '(+ $700)_if_selected'
      ] ?? 0,
    fncd_medical_expenses_200_if_selected:
      quoteData?.comp_fncd_plan?.add_ons?.addl_prem_for_medical_expenses?.[
        '(+ $200)_if_selected'
      ] ?? 0,
  };
}

export function mappedAddOnIncludePlan(quoteData: any): Record<string, any> {
  return {
    COM: quoteData?.comp_plan?.add_ons_included_in_this_plan ?? [],
    TPFT: quoteData?.tpft_plan?.add_ons_included_in_this_plan ?? [],
    TPO: quoteData?.tpo_plan?.add_ons_included_in_this_plan ?? [],
    FNCD: quoteData?.comp_fncd_plan?.add_ons_included_in_this_plan ?? [],
  };
}

export function mappedAddonEligibility(
  quoteData: any,
): Record<string, boolean> {
  return {
    CAR_COM_ANW:
      quoteData?.comp_plan?.add_ons?.any_workshop_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_COM_AJE: false,
    CAR_COM_AND: true,
    CAR_COM_BUN:
      quoteData?.comp_plan?.add_ons?.buy_up_ncd?.buy_up_ncd_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_COM_LOU:
      quoteData?.comp_plan?.add_ons?.loss_of_use_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_COM_PAC:
      quoteData?.comp_plan?.add_ons?.personal_accident_plus_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_COM_MDE:
      quoteData?.comp_plan?.add_ons?.medical_expenses_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_COM_RSA:
      quoteData?.comp_plan?.add_ons?.roadside_assistance_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_COM_KRC:
      quoteData?.comp_plan?.add_ons?.key_replacement_cover_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_COM_NOR:
      quoteData?.comp_plan?.add_ons?.nfr
        ?.new_for_old_replacement_eligibility === ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_ANW:
      quoteData?.comp_fncd_plan?.add_ons?.any_workshop_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_AJE: false,
    CAR_FNCD_AND: true,
    CAR_FNCD_BUN:
      quoteData?.comp_fncd_plan?.add_ons?.buy_up_ncd?.buy_up_ncd_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_LOU:
      quoteData?.comp_fncd_plan?.add_ons?.loss_of_use_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_PAC:
      quoteData?.comp_fncd_plan?.add_ons?.personal_accident_plus_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_MDE:
      quoteData?.comp_fncd_plan?.add_ons?.medical_expenses_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_RSA:
      quoteData?.comp_fncd_plan?.add_ons?.roadside_assistance_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_KRC:
      quoteData?.comp_fncd_plan?.add_ons?.key_replacement_cover_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_FNCD_NOR:
      quoteData?.comp_fncd_plan?.add_ons?.nfr
        ?.new_for_old_replacement_eligibility === ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_TPFT_BUN:
      quoteData?.tpft_plan?.add_ons?.buy_up_ncd?.buy_up_ncd_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_TPFT_AND: true,
    CAR_TPO_BUN:
      quoteData?.tpo_plan?.add_ons?.buy_up_ncd?.buy_up_ncd_eligibility ===
      ADD_ON_VALUES.YES
        ? true
        : false,
    CAR_TPO_AND: true,
  };
}

// NOTE: The 'Loss Of Use' and 'Add Additional Named Driver(s)' addons will be handled with custom logic via the functions applyAddlDriverLogic and applyLouAndCcLogic

export const addonForCarMapCOM: Record<string, string> = {
  CAR_COM_ANW: 'quick_proposal_any_workshop',
  CAR_COM_AJE: 'quick_proposal_excess',
  CAR_COM_BUN: 'quick_proposal_bun',
  CAR_COM_RSA: 'quick_proposal_ra24',
  CAR_COM_NOR: 'quick_proposal_new_for_old',
  CAR_COM_PAC: 'quick_proposal_pa_plus',
  CAR_COM_MDE: 'quick_proposal_me',
  CAR_COM_KRC: 'quick_proposal_krc',
};

export const addonForCarMapTPFT: Record<string, string> = {
  CAR_TPFT_BUN: 'quick_proposal_bun',
};

export const addonForCarMapTPO: Record<string, string> = {
  CAR_TPO_BUN: 'quick_proposal_bun',
};

export const addonForCarMapFNCD: Record<string, string> = {
  CAR_FNCD_ANW: 'quick_proposal_any_workshop',
  CAR_FNCD_AJE: 'quick_proposal_excess',
  CAR_FNCD_BUN: 'quick_proposal_bun',
  CAR_FNCD_RSA: 'quick_proposal_ra24',
  CAR_FNCD_NOR: 'quick_proposal_new_for_old',
  CAR_FNCD_PAC: 'quick_proposal_pa_plus',
  CAR_FNCD_MDE: 'quick_proposal_me',
  CAR_FNCD_KRC: 'quick_proposal_krc',
};

export function mappingAddonByPlan(
  selected_plan: string,
): Record<string, string> {
  switch (selected_plan) {
    case CAR_INSURANCE.PLAN_NAME.COM:
      return addonForCarMapCOM;
    case CAR_INSURANCE.PLAN_NAME.TPFT:
      return addonForCarMapTPFT;
    case CAR_INSURANCE.PLAN_NAME.TPO:
      return addonForCarMapTPO;
    case CAR_INSURANCE.PLAN_NAME.FNCD:
      return addonForCarMapFNCD;
    default:
      return {};
  }
}

export function applyAddlDriverLogic(selected_value: string) {
  if (selected_value === CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.ALL_DRIVERS) {
    return {
      quick_proposal_has_addl_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.NO,
      quick_proposal_has_yied_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.YES,
    };
  } else if (
    selected_value ===
    CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.DRIVERS_AGE_FROM_27_TO_70
  ) {
    return {
      quick_proposal_has_addl_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.YES,
      quick_proposal_has_yied_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.NO,
    };
  } else {
    return {
      quick_proposal_has_addl_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.NO,
      quick_proposal_has_yied_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.NO,
    };
  }
}

export function applyLouAndCcLogic(value: string) {
  if (value === CAR_INSURANCE.ADD_ONS.LOU.YES) {
    return {
      quick_proposal_lou: CAR_INSURANCE.ADD_ONS.LOU.YES,
      quick_proposal_cc: CAR_INSURANCE.ADD_ONS.CC.NO,
    };
  } else if (value === CAR_INSURANCE.ADD_ONS.CC.YES_UP_TO_1600CC) {
    return {
      quick_proposal_lou: CAR_INSURANCE.ADD_ONS.LOU.NO,
      quick_proposal_cc: CAR_INSURANCE.ADD_ONS.CC.YES_UP_TO_1600CC,
    };
  } else if (value === CAR_INSURANCE.ADD_ONS.CC.YES_UP_TO_2000CC) {
    return {
      quick_proposal_lou: CAR_INSURANCE.ADD_ONS.LOU.NO,
      quick_proposal_cc: CAR_INSURANCE.ADD_ONS.CC.YES_UP_TO_2000CC,
    };
  } else {
    return {
      quick_proposal_lou: CAR_INSURANCE.ADD_ONS.LOU.NO,
      quick_proposal_cc: CAR_INSURANCE.ADD_ONS.CC.NO,
    };
  }
}

export const mappingAddonForMaid = {
  MAID_DELU_WOCI: 'quote_mom_bond',
  MAID_DELU_OME: 'quote_opt_op',
  MAID_DELU_WOCP: 'quote_opt_co_payment',
  MAID_CLASS_WOCI: 'quote_mom_bond',
  MAID_CLASS_OME: 'quote_opt_op',
  MAID_CLASS_WOCP: 'quote_opt_co_payment',
  MAID_EXCLU_WOCI: 'quote_mom_bond',
  MAID_EXCLU_OME: 'quote_opt_op',
  MAID_EXCLU_WOCP: 'quote_opt_co_payment',
};
