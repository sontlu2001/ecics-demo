import { prisma } from '@/app/api/libs/prisma';
import {
  mappedAddonPremiums,
  mappedPlanPremiums,
} from '@/app/api/utils/quote.helpers';

export async function formatCarQuoteInfo(
  quoteInfo: any,
  data: any,
): Promise<any[]> {
  const mappedPlanValues = mappedPlanPremiums(quoteInfo);
  const mappedAddonValues = mappedAddonPremiums(quoteInfo);

  const plans = await prisma.plan.findMany({
    where: {
      product_type: {
        name: 'car',
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
          id: 'asc',
        },
      },
    },
    omit: {
      product_type_id: true,
    },
    orderBy: {
      id: 'asc',
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
                dependency.premium_with_gst =
                  mappedAddonValues[dependency.key_map];
              }
            }
          }
        }
      }
    }
  });

  return plans;
}
