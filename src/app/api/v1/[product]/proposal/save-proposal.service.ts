import { CAR_INSURANCE } from '@/app/api/constants/car.insurance';
import { ErrNotFound } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import { prisma } from '@/app/api/libs/prisma';
import { addonToQuickProposalMap, applyAddlDriverLogic, applyLouAndCcLogic } from '@/app/api/utils/quote.helpers';

export async function saveProposalForCar(data: any) {
  const { key, selected_plan, selected_addons, add_named_driver_info } = data;

  const quoteInfo = await prisma.quote.findFirst({
    where: {
      key: key,
    },
    select: {
      quote_id: true,
      proposal_id: true,
    },
  });

  if (!quoteInfo) {
    return ErrNotFound('Quote not found');
  }

  const { quote_id, proposal_id } = quoteInfo;
  const payload: any = {
    proposal_id,
    quote_id,
    quick_proposal_plan: selected_plan,
    __finalize: 0,
    redirect_url: `${process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_WEBSITE}?key=${key}`,
    return_baseurl: process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL,
  };

  for (const [addonKey, quickKey] of Object.entries(addonToQuickProposalMap)) {
    payload[quickKey] = selected_addons[addonKey] || 'NO';
  }

  // update quick_proposal_any_workshop and quick_proposal_excess based on selected_plan
  if (selected_plan !== CAR_INSURANCE.PLAN_NAME.COM) {
    payload.quick_proposal_any_workshop = 'N.A.';
    payload.quick_proposal_excess = 'N.A.';
  }

  // Add-on BUN
  if(selected_plan === CAR_INSURANCE.PLAN_NAME.TPO) {
    payload.quick_proposal_bun = selected_addons['CAR_TPO_BUN'] || 'NO';
  }
  if(selected_plan === CAR_INSURANCE.PLAN_NAME.TPFT) {
    payload.quick_proposal_bun = selected_addons['CAR_TPFT_BUN'] || 'NO';
  }

  // Add-on LOU & CC
  const louKeys = CAR_INSURANCE.CODE_LOUS;
  for (const key of louKeys) {
    if (selected_addons[key]) {
      const result = applyLouAndCcLogic(selected_addons[key]);
      payload.quick_proposal_lou = result.quick_proposal_lou;
      payload.quick_proposal_cc = result.quick_proposal_cc;
      break;
    }
  }

  // Add-on additional driver
  const addlDriverKeys = CAR_INSURANCE.CODE_ADDL_DRIVERS;
  for (const addlDriverKey of addlDriverKeys) {
    if (selected_addons[addlDriverKey]) {
      const result = applyAddlDriverLogic(selected_addons[addlDriverKey]);
      payload.quick_proposal_has_addl_driver = result.quick_proposal_has_addl_driver;
      payload.quick_proposal_has_yied_driver = result.quick_proposal_has_yied_driver;
      break;
    }
  }

  // Add named driver information
  for (let i = 0; i < 3; i++) {
    const driver = add_named_driver_info[i];
    payload[`quick_proposal_addl_nd${i + 1}_name`] = driver?.name || '';
    payload[`quick_proposal_addl_nd${i + 1}_dob`] = driver?.date_of_birth || '';
    payload[`quick_proposal_addl_nd${i + 1}_drv_exp`] =
      driver?.driving_experience ?? '';
    payload[`quick_proposal_addl_nd${i + 1}_nric`] = driver?.nric_or_fin || '';
    payload[`quick_proposal_addl_nd${i + 1}_gender`] = driver?.gender || '';
    payload[`quick_proposal_addl_nd${i + 1}_marital_status`] =
      driver?.marital_status || '';
  }

  return successRes({
    message: 'Proposal saved successfully',
    data: payload,
  });
}

