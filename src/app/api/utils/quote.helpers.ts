import { CAR_INSURANCE } from "../constants/car.insurance";

export function mappedPlanPremiums(quoteData: any): Record<string, number> {
  return {
    COM: quoteData?.comp_plan?.plan_premium_with_gst ?? 0,
    TPFT: quoteData?.tpft_plan?.plan_premium_with_gst ?? 0,
    TPO: quoteData?.tpo_plan?.plan_premium_with_gst ?? 0,
  };
}

export function mappedAddonPremiums(quoteData: any): Record<string, number> {
  return {
    workshop_if_selected:
      quoteData?.comp_plan?.add_ons?.addl_prem_for_any_workshop
        ?.any_workshop_if_selected ?? 0,
    discount_if_any_workshop_not_selected_750:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_not_selected?.[
        '$750_as_default'
      ] ?? 0,
    discount_if_any_workshop_not_selected_1000:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_not_selected?.[
        '$1000_if_selected'
      ] ?? 0,
    discount_if_any_workshop_not_selected_1500:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_not_selected?.[
        '$1500_if_selected'
      ] ?? 0,
    discount_if_any_workshop_not_selected_2000:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_not_selected?.[
        '$2000_if_selected'
      ] ?? 0,
    discount_if_any_workshop_not_selected_3000:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_not_selected?.[
        '$3000_if_selected'
      ] ?? 0,
    discount_if_any_workshop_not_selected_5000:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_not_selected?.[
        '$5000_if_selected'
      ] ?? 0,
    discount_if_any_workshop_selected_1500:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_selected?.[
        '$1500_as_default'
      ] ?? 0,
    discount_if_any_workshop_selected_2000:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_selected?.[
        '$2000_if_selected'
      ] ?? 0,
    discount_if_any_workshop_selected_3000:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_selected?.[
        '$3000_if_selected'
      ] ?? 0,
    discount_if_any_workshop_selected_5000:
      quoteData?.comp_plan?.add_ons?.discount_if_any_workshop_selected?.[
        '$5000_if_selected'
      ] ?? 0,
    drivers_age_from_27_to_70_if_not_selected:
      quoteData?.comp_plan?.add_ons
        ?.addl_named_drivers_premium_if_any_workshop_not_selected
        ?.drivers_age_from_27_to_70_if_selected ?? 0,
    drivers_age_from_27_to_70_if_selected:
      quoteData?.comp_plan?.add_ons
        ?.addl_named_drivers_premium_if_any_workshop_selected
        ?.drivers_age_from_27_to_70_if_selected ?? 0,
    all_drivers_if_not_selected:
      quoteData?.comp_plan?.add_ons
        ?.addl_named_drivers_premium_if_any_workshop_not_selected
        ?.all_drivers_if_selected ?? 0,
    all_drivers_if_selected:
      quoteData?.comp_plan?.add_ons
        ?.addl_named_drivers_premium_if_any_workshop_selected
        ?.all_drivers_if_selected ?? 0,
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
      quoteData?.tpft_plan?.add_ons?.addl_named_drivers_premium
        ?.drivers_age_from_27_to_70_if_selected ?? 0,
    tpft_all_drivers_if_selected:
      quoteData?.tpft_plan?.add_ons?.addl_named_drivers_premium
        ?.all_drivers_if_selected ?? 0,
    tpft_buy_up_ncd_if_selected:
      quoteData?.tpft_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.buy_up_ncd_if_selected ?? 0,
    tpo_drivers_age_from_27_to_70_if_selected:
      quoteData?.tpo_plan?.add_ons?.addl_named_drivers_premium
        ?.drivers_age_from_27_to_70_if_selected ?? 0,
    tpo_all_drivers_if_selected:
      quoteData?.tpo_plan?.add_ons?.addl_named_drivers_premium
        ?.all_drivers_if_selected ?? 0,
    tpo_buy_up_ncd_if_selected:
      quoteData?.tpo_plan?.add_ons?.buy_up_ncd?.addl_prem_for_buy_up_ncd
        ?.buy_up_ncd_if_selected ?? 0,
  };
}

export const addonToQuickProposalMap: Record<string, string> = {
  CAR_COM_ANW: 'quick_proposal_any_workshop',
  CAR_COM_AJE: 'quick_proposal_excess',
  CAR_COM_BUN: 'quick_proposal_bun',
  CAR_COM_RSA: 'quick_proposal_ra24',
  CAR_COM_NOR: 'quick_proposal_new_for_old',
  CAR_COM_PAC: 'quick_proposal_pa_plus',
  CAR_COM_MDE: 'quick_proposal_me',
  CAR_COM_KRC: 'quick_proposal_krc',
  CAR_TPFT_BUN: 'quick_proposal_bun',
  CAR_TPO_BUN: 'quick_proposal_bun',
};

export function applyAddlDriverLogic(selected_value: string){
  if (selected_value === CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.ALL_DRIVERS) {
    return {
      quick_proposal_has_addl_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.NO,
      quick_proposal_has_yied_driver: CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.YES,
    };
  } else if (selected_value === CAR_INSURANCE.ADD_ONS.ADDL_DRIVER.DRIVERS_AGE_FROM_27_TO_70) {
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
