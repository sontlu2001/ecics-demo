import { handleApiCallToISP } from '@/app/api/configs/api.config';
import {
  CAR_INSURANCE,
  PLAN_ADDON_CONFIG,
} from '@/app/api/constants/car.insurance';
import { MAID_INSURANCE } from '@/app/api/constants/maid.insurance';
import { ErrFromISPRes, ErrNotFound } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';
import { convertDate } from '@/app/api/utils/date.helper';
import {
  applyAddlDriverLogic,
  applyLouAndCcLogic,
  mappingAddonByPlan,
  mappingAddonForMaid,
} from '@/app/api/utils/quote.helpers';

import {
  saveQuoteProposalDTO,
  saveQuoteProposalForMaidDTO,
} from './save-proposal.dto';

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
      company_name_other: true,
    },
  });

  if (!quoteInfo) {
    return ErrNotFound('Quote not found');
  }

  const { quote_id, policy_id, proposal_id } = quoteInfo;
  const payload: any = {
    product_id: process.env.PRODUCT_CAR_ID || '',
    policy_id,
    quote_id,
    proposal_id,
    quick_proposal_plan: selected_plan,
    __finalize: 1,
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
      engine_number?: string;
      vehicle_number?: string;
    };
  };

  payload.quick_proposal_veh_reg_no =
    vehicle_info_selected?.vehicle_number || '';
  payload.quick_proposal_chassis_no =
    vehicle_info_selected?.chasis_number || '';
  payload.quick_proposal_engine_no = vehicle_info_selected?.engine_number || '';
  payload.quick_proposal_hire_purchase = quoteInfo.company?.name || '';
  payload.quick_proposal_other_hire_purchase =
    quoteInfo.company?.name === '-- Others (Not Available in this list) --'
      ? quoteInfo?.company_name_other
      : '';
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
      quote_finalize_from_ISP: resSaveProposal,
      is_finalized: true,
      payment_id: resSaveProposal.data?.payment_id || '',
    },
  });

  return successRes({
    message: 'Proposal saved successfully',
    data: resSaveProposal.data,
  });
}

export async function saveProposalForMaid(data: saveQuoteProposalForMaidDTO) {
  const { key, selected_plan, selected_addons, personal_info, maid_info } =
    data;

  const quoteInfo = await prisma.quote.findFirst({
    where: {
      key: key,
    },
  });

  if (!quoteInfo) {
    return ErrNotFound('Quote not found');
  }

  const { quote_id, policy_id, proposal_id } = quoteInfo;
  const [
    quote_insured_dob_day,
    quote_insured_dob_month,
    quote_insured_dob_year,
  ] = convertDate(data.personal_info.date_of_birth);
  const [nationalInfo, companyInfo] = await Promise.all([
    prisma.countryNationality.findFirst({
      where: {
        name: data.personal_info.nationality,
      },
    }),
    prisma.company.findFirst({
      where: {
        name: data.maid_info.company_name,
      },
    }),
  ]);

  if (!nationalInfo) {
    return ErrNotFound('Nationality not found');
  }

  if (data.maid_info?.has_helper_worked_12_months === 'YES' && !companyInfo) {
    return ErrNotFound('Company not found');
  }

  const payload: any = {
    product_id: process.env.PRODUCT_MAID_ID || '',
    policy_id: policy_id,
    quote_id: quote_id,
    proposal_id: proposal_id,
    plan: selected_plan,
    quote_employer_name: personal_info.name,
    quote_employer_nric: personal_info.nric,
    quote_insured_dob_day: quote_insured_dob_day,
    quote_insured_dob_month: quote_insured_dob_month,
    quote_insured_dob_year: quote_insured_dob_year,
    quote_employer_nationality: nationalInfo.name,
    quote_employer_address_line1: personal_info.address?.[0] || '',
    quote_employer_address_line2: personal_info.address?.[1] || '',
    quote_employer_address_line3: personal_info.address?.[2] || '',
    quote_employer_postal_code: personal_info.post_code || '',
    quote_maid_name: maid_info.name,
    quote_maid_work_permit_no: maid_info.fin,
    quote_maid_passport_no: maid_info.passport_number,
    quote_previous_insurer: maid_info.company_name,
    quote_previous_insurer_others: maid_info.company_name_other,
    quote_employed_by_proposer: maid_info.has_helper_worked_12_months,
    __finalize: 1,
    redirect_url: `${process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_FOR_MAID_WEBSITE}?key=${key}`,
    return_baseurl: process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL,
  };

  const convertedAddons = Object.entries(mappingAddonForMaid)
    .map(([oldKey, newId]) => {
      if (oldKey in selected_addons && selected_addons[oldKey] !== 'NO') {
        const value = selected_addons[oldKey];
        return value === 'YES' ? { id: newId } : { id: newId, option: value };
      }
    })
    .filter(Boolean);

  payload.add_ons = convertedAddons;
  logger.info(`Payload for save proposal for maid: ${JSON.stringify(payload)}`);

  const resSaveProposal = await handleApiCallToISP(
    `${MAID_INSURANCE.PREFIX_ENDPOINT}/proposal_finalize`,
    payload,
  );

  logger.info(
    `Response from save proposal: ${JSON.stringify(resSaveProposal)}`,
  );

  if (resSaveProposal.status !== 0) {
    return ErrFromISPRes('Failed to save proposal');
  }

  await prisma.quote.update({
    where: {
      id: quoteInfo.id,
    },
    data: {
      quote_finalize_from_ISP: resSaveProposal,
      is_finalized: true,
      payment_id: resSaveProposal.data?.payment_id || '',
      company_id: companyInfo?.id || null,
    },
  });

  return successRes({
    message: 'Proposal saved successfully',
    data: resSaveProposal.data,
  });
}
