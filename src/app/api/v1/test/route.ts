import { NextRequest } from "next/server";
import logger from "../../libs/logger";
import { successRes } from "../../core/success.response";
import { prisma } from "../../libs/prisma";
import {
  listKeyMapOptions,
  mappedAddonPremiums,
  mappedPlanPremiums,
} from "../../utils/quote.helpers";
import { quoteInfo } from "../../utils/example";
import { strict } from "assert";

export const GET = async (req: NextRequest, context: { params: { product_type: string } }) => {
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
          order: true,
          is_active: true,
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

  const mappedPlanValues = mappedPlanPremiums(quoteInfo);
  const mappedAddonValues = mappedAddonPremiums(quoteInfo);

  plans.forEach((plan) => {
    if (plan.code && plan.code in mappedPlanValues) {
      plan.premium_with_gst = mappedPlanValues[plan.code];
    }

    for (const addon of plan.addons) {
      const { key_map, options } = addon;

      if (key_map && options.length === 0) {
        addon.premium_with_gst = mappedAddonValues[key_map];
        continue;
      }

      addon.options = options.filter(opt => listKeyMapOptions.has(opt.key_map as string));

      for (const option of addon.options) {
        if (option.key_map) {
          option.premium_with_gst = mappedAddonValues[option.key_map];
        }

        for (const dependency of option.dependencies || []) {
          if (dependency.key_map) {
            dependency.premium_with_gst = mappedAddonValues[dependency.key_map];
          }
        }
      }
    }
  });

  return successRes({
    data: plans,
    message: "Companies fetched successfully",
  });
};
