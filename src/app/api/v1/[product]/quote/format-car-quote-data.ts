import logger from "@/app/api/libs/logger";
import { prisma } from "@/app/api/libs/prisma";
import { mappedAddonPremiums, mappedPlanPremiums } from "@/app/api/utils/quoteHelpers";

export async function formatCarQuoteInfo(quoteInfo: any, data: any) {
  const mappedPlanValues = mappedPlanPremiums(quoteInfo);
  const mappedAddonValues = mappedAddonPremiums(quoteInfo);

  const plans = await prisma.plan.findMany({
    where: {
      product_type: {
        name: "car",
      },
    },
    include: {
      benefits: {
        select: {
          id: true,
          name: true,
        },
      },
      product_type: {
        select: {
          id: true,
          name: true,
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
          id: "asc",
        },
      },
    },
    omit: {
      product_type_id: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  plans.forEach((plan) => {
    if (plan.code && plan.code in mappedPlanValues) {
      plan.premium_with_gst = mappedPlanValues[plan.code];
    }

    for (const addon of plan.addons) {
      if (addon.key_map && addon.options.length === 0) {
        addon.premium_with_gst = mappedAddonValues[addon.key_map];
      } else {
        for (const option of addon.options) {
          if (option.key_map) {
            option.premium_with_gst = mappedAddonValues[option.key_map];
          } else {
            for (const dependency of option.dependencies) {
              if (dependency.key_map) {
                dependency.premium_with_gst = mappedAddonValues[dependency.key_map];
              }
            }
          }
        }
      }
    }
  });

  logger.info(`Formatted plans: ${JSON.stringify(plans)}`);

  return {
    quote_info: {
      product_id: quoteInfo.product_id,
      policy_id: quoteInfo.policy_id,
      quote_no: quoteInfo.quote_no,
      proposal_id: quoteInfo.proposal_id,
      quote_expiry_date: quoteInfo.quote_expiry_date,
      is_electric_vehicle_model: quoteInfo.is_electric_vehicle_model,
      is_performance_model: quoteInfo.is_performance_model,
      ncb: quoteInfo.ncb,
      key: data.key,
      partner_code: quoteInfo.partner_code || "",
      partner_name: quoteInfo.partner_name || "",
      promo_code: quoteInfo.promo_code || "",
    },
    plans,
  };
}
