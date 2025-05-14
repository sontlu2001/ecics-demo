import { handleApiCallToISP } from '@/app/api/configs/api.config';
import {
  CAR_INSURANCE,
  PLAN_ADDON_CONFIG,
} from '@/app/api/constants/car.insurance';
import { ErrFromISPRes, ErrNotFound } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';
import {
  applyAddlDriverLogic,
  applyLouAndCcLogic,
  mappingAddonByPlan,
} from '@/app/api/utils/quote.helpers';
import { saveQuoteProposalDTO } from './save-proposal.dto';
import { PRODUCT_ID } from '@/app/api/constants/product';

export async function saveProposalForCar(data: saveQuoteProposalDTO) {
  const { key, selected_plan, selected_addons, add_named_driver_info } = data;

  const quoteInfo = await prisma.quote.findFirst({
    where: {
      key: key,
    },
    select: {
      quote_id: true,
      proposal_id: true,
      policy_id: true,
      data: true,
      id: true,
      company: true,
    },
  });

  if (!quoteInfo) {
    return ErrNotFound('Quote not found');
  }

  const { quote_id, policy_id, proposal_id } = quoteInfo;
  const payload: any = {
    product_id: PRODUCT_ID.CAR,
    policy_id,
    quote_id,
    proposal_id,
    quick_proposal_plan: selected_plan,
    __finalize: 0,
    redirect_url: `${process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_WEBSITE}?key=${key}`,
    return_baseurl: process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL,
  };

  const addonKeysMapping = mappingAddonByPlan(selected_plan);
  for (const [addonKey, quickKey] of Object.entries(addonKeysMapping)) {
    payload[quickKey] = selected_addons[addonKey] || 'NO';
  }

  const planAddOnConfig = PLAN_ADDON_CONFIG[selected_plan];

  if (planAddOnConfig) {
    if (planAddOnConfig.setDefaults) {
      payload.quick_proposal_any_workshop = 'N.A.';
      payload.quick_proposal_excess = 'N.A.';
    }

    const { quick_proposal_has_addl_driver, quick_proposal_has_yied_driver } =
      applyAddlDriverLogic(selected_addons[planAddOnConfig.andKey]);

    payload.quick_proposal_has_addl_driver = quick_proposal_has_addl_driver;
    payload.quick_proposal_has_yied_driver = quick_proposal_has_yied_driver;

    if (planAddOnConfig.applyLouAndCc && planAddOnConfig.louKey) {
      const { quick_proposal_lou, quick_proposal_cc } = applyLouAndCcLogic(
        selected_addons[planAddOnConfig.louKey],
      );

      payload.quick_proposal_lou = quick_proposal_lou;
      payload.quick_proposal_cc = quick_proposal_cc;
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

  // Add personal information
  const { personal_info, vehicle_info_selected } = quoteInfo.data as {
    personal_info: {
      name?: string;
      nric?: string;
      gender?: string;
      date_of_birth?: string;
      marital_status?: string;
      address?: string[];
      post_code?: string;
    };
    vehicle_info_selected: {
      chasis_number?: string;
      chassis_no?: string;
      engine_no?: string;
      vehicle_number?: string;
    };
  };

  payload.quick_proposal_veh_reg_no =
    vehicle_info_selected?.vehicle_number || '';
  payload.quick_proposal_chassis_no = vehicle_info_selected?.chassis_no || '';
  payload.quick_proposal_engine_no = vehicle_info_selected?.engine_no || '';
  payload.quick_proposal_hire_purchase = quoteInfo.company?.name || '';
  payload.quick_proposal_proposer_name = personal_info?.name || '';
  payload.quick_proposal_proposer_nric = personal_info?.nric || '';
  payload.quick_proposal_proposer_gender = personal_info?.gender || '';
  payload.quick_proposal_proposer_marital_status =
    personal_info?.marital_status || '';
  payload.quick_proposal_address_line1 = personal_info?.address?.[0] || '';
  payload.quick_proposal_address_line2 = personal_info?.address?.[1] || '';
  payload.quick_proposal_address_line3 = personal_info?.address?.[2] || '';
  payload.quick_proposal_post_code = personal_info?.post_code || '';

  logger.info(`Payload for save proposal: ${JSON.stringify(payload)}`);

  const resSaveProposal = await handleApiCallToISP(
    `/${CAR_INSURANCE.PREFIX_ENDPOINT}/proposal`,
    payload,
  );
  logger.info(
    `Response from save proposal: ${JSON.stringify(resSaveProposal)}`,
  );

  if (resSaveProposal.status !== 0) {
    return ErrFromISPRes('Failed to save proposal');
  }

  // Update the quote in the database
  const quoteData = quoteInfo.data;
  await prisma.quote.update({
    where: {
      id: quoteInfo.id,
    },
    data: {
      data: {
        ...(quoteData && typeof quoteData === 'object' ? quoteData : {}),
        selected_addons: selected_addons,
        add_named_driver_info: add_named_driver_info,
      },
    },
  });

  return successRes({
    message: 'Proposal saved successfully',
    data: resSaveProposal.data,
  });
}
