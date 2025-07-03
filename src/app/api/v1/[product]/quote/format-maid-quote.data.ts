import { v4 as uuid } from 'uuid';

import { MAID_INSURANCE } from '@/app/api/constants/maid.insurance';
import { PRODUCT_NAME } from '@/app/api/constants/product';
import { prisma } from '@/app/api/libs/prisma';

interface MaidPlan {
  title: string;
  most_popular: boolean;
  eligibility: boolean;
  premium_before_discount: number;
  premium_with_discount: number;
}

export async function formatMaidQuoteInfo(
  quoteInfo?: any,
  data?: any,
): Promise<any[]> {
  const mappedPlanPremiumWithGST: Record<string, number> = {
    Classic:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.CLASSIC,
      )?.premium_with_discount || 0,
    Deluxe:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.DELUXE,
      )?.premium_with_discount || 0,
    Exclusive:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.EXCLUSIVE,
      )?.premium_with_discount || 0,
  };

  const mappedPlanEligibility: Record<string, boolean> = {
    Classic:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.CLASSIC,
      )?.eligibility || false,
    Deluxe:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.DELUXE,
      )?.eligibility || false,
    Exclusive:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.EXCLUSIVE,
      )?.eligibility || false,
  };

  const mappedPlanMostPopular: Record<string, boolean> = {
    Classic:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.CLASSIC,
      )?.most_popular || false,
    Deluxe:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.DELUXE,
      )?.most_popular || false,
    Exclusive:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.EXCLUSIVE,
      )?.most_popular || false,
  };

  const mappedPlanBenefits: Record<string, any[]> = {
    Classic:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.CLASSIC,
      )?.benefits || [],
    Deluxe:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.DELUXE,
      )?.benefits || [],
    Exclusive:
      quoteInfo?.plans.find(
        (plan: MaidPlan) => plan.title === MAID_INSURANCE.PLANS.EXCLUSIVE,
      )?.benefits || [],
  };

  const mappedAddonPremiumWithGST: Record<string, number> = {
    maid_classic_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.default_premium || 0,
    maid_deluxe_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.default_premium || 0,
    maid_exclusive_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.default_premium || 0,
    maid_classic_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.default_premium || 0,
    maid_deluxe_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.default_premium || 0,
    maid_exclusive_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.default_premium || 0,
  };

  const mappedOptionAddonPremiumWithGST: Record<string, number> = {
    classic_outpatient_medical_expenses_300:
      quoteInfo?.add_ons
        .find(
          (addon: any) =>
            addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
            addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
        )
        .additional_premium_options.find(
          (option: any) => option.title === 'S$300',
        ).additional_premium || 0,
    classic_outpatient_medical_expenses_500:
      quoteInfo?.add_ons
        .find(
          (addon: any) =>
            addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
            addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
        )
        .additional_premium_options.find(
          (option: any) => option.title === 'S$500',
        ).additional_premium || 0,
    deluxe_outpatient_medical_expenses_300:
      quoteInfo?.add_ons
        .find(
          (addon: any) =>
            addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
            addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
        )
        .additional_premium_options.find(
          (option: any) => option.title === 'S$300',
        ).additional_premium || 0,
    deluxe_outpatient_medical_expenses_500:
      quoteInfo?.add_ons
        .find(
          (addon: any) =>
            addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
            addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
        )
        .additional_premium_options.find(
          (option: any) => option.title === 'S$500',
        ).additional_premium || 0,
    exclusive_outpatient_medical_expenses_300:
      quoteInfo?.add_ons
        .find(
          (addon: any) =>
            addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
            addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
        )
        .additional_premium_options.find(
          (option: any) => option.title === 'S$300',
        ).additional_premium || 0,
    exclusive_outpatient_medical_expenses_500:
      quoteInfo?.add_ons
        .find(
          (addon: any) =>
            addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
            addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
        )
        .additional_premium_options.find(
          (option: any) => option.title === 'S$500',
        ).additional_premium || 0,
  };

  const mappedAddonEligibility: Record<string, boolean> = {
    maid_classic_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.eligibility || false,
    maid_deluxe_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.eligibility || false,
    maid_exclusive_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.eligibility || false,
    maid_classic_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.eligibility || false,
    maid_deluxe_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.eligibility || false,
    maid_exclusive_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.eligibility || false,
    maid_deluxe_ome:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.eligibility || false,
    maid_exclusive_ome:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.eligibility || false,
    maid_classic_ome:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.eligibility || false,
  };

  const mappedAddonDescription: Record<string, string> = {
    maid_classic_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.description || '',
    maid_deluxe_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.description || '',
    maid_exclusive_woci:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCI.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.description || '',
    maid_classic_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.description || '',
    maid_deluxe_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.description || '',
    maid_exclusive_wocp:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.WOCP.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.description || '',
    maid_deluxe_ome:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.DELUXE),
      )?.description || '',
    maid_exclusive_ome:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.EXCLUSIVE),
      )?.description || '',
    maid_classic_ome:
      quoteInfo?.add_ons.find(
        (addon: any) =>
          addon.id === MAID_INSURANCE.ADD_ONS.OME.ID &&
          addon.plans.includes(MAID_INSURANCE.PLANS.CLASSIC),
      )?.description || '',
  };

  const plans = await prisma.plan.findMany({
    where: {
      product_type: {
        name: PRODUCT_NAME.MAID,
      },
    },
    include: {
      benefits: {
        select: {
          id: true,
          name: true,
          order: true,
          is_active: true,
        },
      },
      addons: {
        select: {
          id: true,
          code: true,
          title: true,
          sub_title: true,
          type: true,
          description: true,
          default_option_id: true,
          key_map: true,
          is_display: true,
          is_recommended: true,
          premium_with_gst: true,
          premium_bef_gst: true,
          options: {
            select: {
              id: true,
              label: true,
              value: true,
              description: true,
              key_map: true,
              premium_bef_gst: true,
              premium_with_gst: true,
              dependencies: {
                select: {
                  conditions: {
                    select: {
                      addon: {
                        select: {
                          id: true,
                          code: true,
                          title: true,
                        },
                      },
                      value: true,
                    },
                  },
                  key_map: true,
                  premium_with_gst: true,
                  premium_bef_gst: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      },
    },
    omit: {
      product_type_id: true,
    },
    orderBy: [{ is_recommended: 'desc' }, { id: 'asc' }],
  });

  plans.forEach((plan) => {
    if (plan.title in mappedPlanPremiumWithGST) {
      plan.premium_with_gst = mappedPlanPremiumWithGST[plan.title];
      plan.is_display = mappedPlanEligibility[plan.title];
      plan.is_recommended = mappedPlanMostPopular[plan.title];
      plan.benefits = mappedPlanBenefits[plan.title] || [];
      if (Array.isArray(quoteInfo.add_ons_included)) {
        for (const addon of quoteInfo.add_ons_included) {
          if (
            addon.plans.includes(plan.title) &&
            Array.isArray(plan.add_ons_included_in_this_plan)
          ) {
            plan.add_ons_included_in_this_plan.push({
              add_on_id: addon.id || uuid(),
              add_on_name: addon.title,
              add_on_desc: addon.description,
            });
          }
        }
      }
    }

    for (const addon of plan.addons) {
      if (addon.key_map) {
        addon.is_display = mappedAddonEligibility[addon.key_map];
        addon.description = mappedAddonDescription[addon.key_map];
        if (addon.options.length === 0) {
          addon.premium_with_gst = mappedAddonPremiumWithGST[addon.key_map];
        } else {
          for (const option of addon.options) {
            if (option.key_map) {
              option.premium_with_gst =
                mappedOptionAddonPremiumWithGST[option.key_map];
            }
          }
        }
      }
    }
  });

  return plans;
}
