import { v4 as uuidv4 } from 'uuid';

export function formatCarQuoteInfo(quoteInfo: any, data: any) {
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
      partner_code: quoteInfo.partner_code || '',
      partner_name: quoteInfo.partner_name || '',
      promo_code: quoteInfo.promo_code || '',
    },
    plans: [
      {
        id: 'COM',
        title: 'Comprehensive',
        benefits: [
          {
            name: '<p>Third-Party liability coverage relating to vehicle charging',
            is_active: true,
          },
          {
            name: '<p>Free NCD Protector (from 10%) & Waiver of Excess</p>',
            is_active: true,
          },
          {
            name: '<p>Complete Vehicle Coverage</p>',
            is_active: true,
          },
          {
            name: '<p>Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models</p>',
            is_active: true,
          },
        ],
        sub_title: 'Ultimate Protection & Convenience',
        is_recommended: true,
        premium_with_gst: quoteInfo?.comp_plan?.plan_premium_with_gst,
        premium_bef_gst: 0,
        addons: [
          {
            id: 'ANW',
            title: 'Any Workshops',
            type: 'select',
            is_display:
              quoteInfo?.comp_plan?.add_ons?.any_workshop_eligibility === 'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              "Enjoy the flexibility to repair your car at any specific dealer's workshop or workshop of your choice. * a minimum of $1,500 excess apply.",
            default_option_id: null,
            options: [
              {
                id: uuidv4(),
                label: '',
                description: '',
                value: '',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan.add_ons?.addl_prem_for_any_workshop
                    ?.any_workshop_if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'AJE',
            key: 'adjustable_excess',
            title: 'Adjustable Excess',
            type: 'checkbox',
            is_display: false,
            is_recommended: false,
            description: '',
            default_option_id: null,
            depends_on: ['ANW'],
            options: [
              {
                id: uuidv4(),
                label: '$750',
                value: 'SGD 750.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_not_selected
                        ?.$750_as_default || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$1000',
                value: 'SGD 1,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_not_selected
                        ?.$1000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$1500',
                value: 'SGD 1,500.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_not_selected
                        ?.$1500_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$2000',
                value: 'SGD 2,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_not_selected
                        ?.$2000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$3000',
                value: 'SGD 3,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_not_selected
                        ?.$3000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$5000',
                value: 'SGD 5,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_not_selected
                        ?.$5000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$1500',
                value: 'SGD 1,500.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_selected?.$1500_as_default ||
                      0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$2000',
                value: 'SGD 2,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_selected
                        ?.$2000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$3000',
                value: 'SGD 3,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_selected
                        ?.$3000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$3000',
                value: 'SGD 3,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_selected
                        ?.$3000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: '$5000',
                value: 'SGD 5,000.00',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.discount_if_any_workshop_selected
                        ?.$5000_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
            ],
          },
          {
            id: 'AND',
            title: 'Add Additional Named Driver(s)',
            type: 'checkbox',
            is_display:
              quoteInfo.comp_plan.add_ons.addl_named_drivers_eligibility ===
              'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Extend the coverage to any driver you choose to name under your policy.',
            default_option_id: 'EDAF',
            depends_on: ['ANW'],
            options: [
              {
                id: uuidv4(),
                label: 'Experienced drivers age between 26 to 65',
                description:
                  'Driver(s) between 26 to 65 years old (both inclusive) who holds a valid local driving license for 2 years and above.',
                value: 'drivers_age_from_27_to_70',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan.add_ons
                        ?.addl_named_drivers_premium_if_any_workshop_not_selected
                        ?.drivers_age_from_27_to_70_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: 'Experienced & Inexperienced drivers of all age',
                description:
                  'Drivers of all age or driving experience including Young (<26 years old), Elderly (>65 years old) or Inexperienced (<2 years driving experience) drivers.',
                value: 'all_drivers',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.addl_named_drivers_premium_if_any_workshop_not_selected
                        ?.all_drivers_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: 'Experienced drivers age between 26 to 65',
                description:
                  'Driver(s) between 26 to 65 years old (both inclusive) who holds a valid local driving license for 2 years and above.',
                value: 'drivers_age_from_27_to_70',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons
                        ?.addl_named_drivers_premium_if_any_workshop_selected
                        ?.drivers_age_from_27_to_70_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
              {
                id: uuidv4(),
                label: 'Experienced & Inexperienced drivers of all age',
                description:
                  'Drivers of all age or driving experience including Young (<26 years old), Elderly (>65 years old) or Inexperienced (<2 years driving experience) drivers.',
                value: 'all_drivers',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan.add_ons
                        ?.addl_named_drivers_premium_if_any_workshop_selected
                        ?.all_drivers_if_selected || 0,
                    premium_bef_gst: 0,
                  },
                ],
              },
            ],
          },
          {
            id: 'BUN',
            title: '50% Buy Up NCD',
            type: 'select',
            is_display:
              quoteInfo?.comp_plan?.add_ons?.buy_up_ncd
                ?.buy_up_ncd_eligibility === 'Yes'
                ? true
                : false,
            is_recommended: false,
            description: 'Boost your NCD to 50%.',
            default_option_id: null,
            depends_on: ['ANW'],
            options: [
              {
                id: uuidv4(),
                label: '',
                description: '',
                dependencies: [
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: false,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons?.buy_up_ncd
                        ?.addl_prem_for_buy_up_ncd
                        ?.addl_prem_for_buy_up_ncd_if_any_workshop_not_selected ||
                      0,
                    premium_bef_gst: 0,
                  },
                  {
                    conditions: [
                      {
                        addon_id: 'ANW',
                        value: true,
                      },
                    ],
                    premium_with_gst:
                      quoteInfo?.comp_plan?.add_ons?.buy_up_ncd
                        ?.addl_prem_for_buy_up_ncd
                        ?.addl_prem_for_buy_up_ncd_if_any_workshop_selected ||
                      0,
                    premium_bef_gst: 0,
                  },
                ],
              },
            ],
          },
          {
            id: 'LOU',
            title: 'Loss Of Use',
            type: 'checkbox',
            is_display:
              quoteInfo?.comp_plan?.add_ons?.loss_of_use_eligibility === 'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Compensates you with Transport Allowance or Courtesy Car when your car is being repaired due to an accident.',
            default_option_id: 'TALL',
            options: [
              {
                id: uuidv4(),
                label: 'Transport Allowance',
                description:
                  'Compensates you with S$50 per day (for up to 10 days) when your car is being repaired due to accident.',
                value: 'Transport Allowance',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons?.addl_prem_for_loss_of_use
                    ?.transport_allowance_if_selected || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: 'Courtesy Car 1,600cc',
                description:
                  'Compensates with a Rental car up to 1,600cc provided for up to 10 days from the commencement of accident repair.',
                value: 'Courtesy Car (up to 1,600cc)',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons?.addl_prem_for_loss_of_use
                    ?.courtesy_car_up_to_1600cc_if_selected || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: 'Courtesy Car 2,000cc',
                description:
                  'Compensates with a Rental car up to 2,000cc provided for up to 10 days from the commencement of accident repair.',
                value: 'Courtesy Car (up to 2,000cc)',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons?.addl_prem_for_loss_of_use
                    ?.courtesy_car_up_to_2000cc_if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'PAP',
            title: 'Personal Accident+',
            type: 'checkbox',
            is_display:
              quoteInfo?.comp_plan?.add_ons
                ?.personal_accident_plus_eligibility === 'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Enjoy additional coverage to your basic policy coverage for the policy owner and/or Named Driver who is driving the motor car at the point of accident. You may enjoy additional coverage by selecting one of the options.',
            default_option_id: 'CU30K',
            options: [
              {
                id: uuidv4(),
                label: '+$30,000',
                description: 'Increase the coverage up to S$80,000.',
                value: '+SGD 30K',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_personal_accident_plus?.[
                    '(+ $30K)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: '+$60,000',
                description: 'Increase the coverage up to S$110,000.',
                value: '+SGD 60K',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_personal_accident_plus?.[
                    '(+ $60K)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: '+SGD 100K',
                description: 'Increase the coverage up to S$150,000.',
                value: '+SGD 100K',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_personal_accident_plus?.[
                    '(+ $100K)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'MDE',
            title: 'Medical Expenses',
            type: 'checkbox',
            is_display:
              quoteInfo?.comp_plan?.add_ons?.medical_expenses_eligibility ===
              'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Enjoy additional coverage to your basic policy coverage for the policy owner and/or Named Driver who is driving the motor car at the point of accident. You may enjoy additional coverage by selecting one of the options.',
            default_option_id: 'MCU200',
            options: [
              {
                id: uuidv4(),
                label: '+$200',
                description: 'Increase the coverage up to S$700.',
                value: '+SGD 200',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_medical_expenses?.[
                    '(+ $200)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: '+$700',
                description: 'Increase the coverage up to S$1,200.',
                value: '+SGD 700',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_medical_expenses?.[
                    '(+ $700)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: '+$1,700',
                description: 'Increase the coverage up to S$2,200.',
                value: '+SGD 1,700',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_medical_expenses?.[
                    '(+ $1700)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'RSA',
            title: '24x7 Roadside Assistance',
            type: 'select',
            is_display:
              quoteInfo.comp_plan.add_ons.roadside_assistance_eligibility ===
              'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Receive roadside assistance support to fix minor car breakdown problems anywhere in Singapore.',
            default_option_id: false,
            options: [
              {
                id: uuidv4(),
                label: '',
                value: '',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_roadside_assistance?.if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'KRC',
            title: 'Key Replacement Cover',
            type: 'checkbox',
            is_display:
              quoteInfo?.comp_plan?.add_ons
                ?.key_replacement_cover_eligibility === 'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Enjoy reimbursement on the replacement of your motor car keys which are lost as a result of Theft, Robbery or an Accident.',
            default_option_id: 'KRC300',
            options: [
              {
                id: uuidv4(),
                label: '$300 Cover',
                description: '',
                value: 'SGD 300',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_key_replacement_cover?.[
                    '($300)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: '$500 Cover',
                description: '',
                value: 'SGD 500',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_key_replacement_cover?.[
                    '($500)_if_selected'
                  ] || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'RSA',
            title: '24x7 Roadside Assistance',
            type: 'select',
            is_display:
              quoteInfo.comp_plan.add_ons.roadside_assistance_eligibility ===
              'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Receive roadside assistance support to fix minor car breakdown problems anywhere in Singapore.',
            default_option_id: null,
            options: [
              {
                id: uuidv4(),
                label: '',
                value: '',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons
                    ?.addl_prem_for_roadside_assistance?.if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'NOR',
            title: 'New for Old Replacement',
            type: 'select',
            is_display:
              quoteInfo?.comp_plan?.add_ons?.nfr
                ?.new_for_old_replacement_eligibility === 'Yes'
                ? true
                : false,
            description:
              'Brand new vehicle replacement in event of an accident resulting in total loss as long as your vehicle is less than 24 months old.',
            default_option_id: null,
            options: [
              {
                id: uuidv4(),
                label: '',
                value: '',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons?.nfr
                    ?.addl_prem_for_new_for_old_replacement?.if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
        ],
      },
      {
        id: 'TPFT',
        title: 'Third Party & Theft',
        sub_title: 'Essential Coverage for Everyday Driving',
        benefits: [
          {
            name: '<p>Third-Party liability coverage relating to vehicle charging</p>',
            is_active: true,
          },
          {
            name: '<p>Protection against loss/damage to third party, by fire or theft</p>',
            is_active: true,
          },
          {
            name: '<p>Complete Vehicle Coverage</p>',
            is_active: false,
          },
          {
            name: '</p>Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models</p>',
            is_active: false,
          },
        ],
        is_recommended: false,
        premium_with_gst: quoteInfo.comp_plan.plan_premium_with_gst,
        premium_bef_gst: 0,
        addons: [
          {
            id: 'AND',
            title: 'Add Additional Named Driver(s)',
            type: 'checkbox',
            is_display:
              quoteInfo?.tpo_plan?.add_ons?.addl_named_drivers_eligibility ===
              'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Extend the coverage to any driver you choose to name under your policy.',
            default_option_id: 'EDR',
            options: [
              {
                id: uuidv4(),
                label: 'Experienced drivers age between 26 to 65',
                description:
                  'Driver(s) between 26 to 65 years old (both inclusive) who holds a valid local driving license for 2 years and above.',
                value: 'drivers_age_from_27_to_70',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.tpo_plan?.add_ons?.addl_named_drivers_premium
                    ?.drivers_age_from_27_to_70_if_selected || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: 'Experienced & Inexperienced drivers of all age',
                description:
                  'Drivers of all age or driving experience including Young (<26 years old), Elderly (>65 years old) or Inexperienced (<2 years driving experience) drivers.',
                value: 'all_drivers',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.tpo_plan?.add_ons?.addl_named_drivers_premium
                    ?.all_drivers_if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'BUN',
            key: 'buy_up_ncd',
            title: '50% Buy Up NCD',
            type: 'select',
            is_display:
              quoteInfo?.tpo_plan?.add_ons?.buy_up_ncd
                ?.buy_up_ncd_eligibility === 'Yes'
                ? true
                : false,
            is_recommended: false,
            description: 'Boost your NCD to 50%.',
            default_option_id: null,
            options: [
              {
                id: uuidv4(),
                label: '',
                description: '',
                value: '',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.comp_plan?.add_ons?.buy_up_ncd
                    ?.addl_prem_for_buy_up_ncd
                    ?.addl_prem_for_buy_up_ncd_if_any_workshop_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
        ],
      },
      {
        id: 'TPO',
        title: 'Third Party Only',
        ub_title: 'Baisc Protection for your car',
        benefits: [
          {
            name: '<p>Third-Party liability coverage relating to vehicle charging</p>',
            is_active: true,
          },
          {
            name: '<p>Free NCD Protector (from 10%)</p>',
            is_active: true,
          },
          {
            name: '<p>Up to $50,000 complimentary Personal Accident coverage</p>',
            is_active: true,
          },
          {
            name: '<p>Protection against loss/damage to third party, by fire or theft</p>',
            is_active: false,
          },
          {
            name: '<p>Complete Vehicle Coverage</p>',
            is_active: false,
          },
          {
            name: '<p>Policy Excess: $750 for non-EV & BYD models & $1,500 for Tesla models</p>',
            is_active: false,
          },
        ],
        is_recommended: false,
        premium_with_gst: quoteInfo.comp_plan.plan_premium_with_gst,
        premium_bef_gst: 0,
        addons: [
          {
            id: 'AND',
            title: 'Add Additional Named Driver(s)',
            type: 'checkbox',
            is_display:
              quoteInfo?.tpo_plan?.add_ons?.addl_named_drivers_eligibility ===
              'Yes'
                ? true
                : false,
            is_recommended: false,
            description:
              'Extend the coverage to any driver you choose to name under your policy.',
            default_option_id: 'JDH',
            options: [
              {
                id: uuidv4(),
                label: 'Experienced drivers age between 26 to 65',
                description:
                  'Driver(s) between 26 to 65 years old (both inclusive) who holds a valid local driving license for 2 years and above.',
                value: 'drivers_age_from_27_to_70',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.tpo_plan?.add_ons?.addl_named_drivers_premium
                    ?.drivers_age_from_27_to_70_if_selected || 0,
                premium_bef_gst: 0,
              },
              {
                id: uuidv4(),
                label: 'Experienced & Inexperienced drivers of all age',
                description:
                  'Drivers of all age or driving experience including Young (<26 years old), Elderly (>65 years old) or Inexperienced (<2 years driving experience) drivers.',
                value: 'all_drivers',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.tpo_plan?.add_ons?.addl_named_drivers_premium
                    ?.all_drivers_if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
          {
            id: 'BUN',
            title: '50% Buy Up NCD',
            type: 'select',
            is_display:
              quoteInfo?.tpo_plan?.add_ons?.buy_up_ncd
                ?.buy_up_ncd_eligibility === 'Yes'
                ? true
                : false,
            is_recommended: false,
            description: 'Boost your NCD to 50%.',
            default_option: null,
            options: [
              {
                id: uuidv4(),
                label: '',
                description: '',
                value: '',
                dependencies: [],
                premium_with_gst:
                  quoteInfo?.tpo_plan?.add_ons?.buy_up_ncd
                    ?.addl_prem_for_buy_up_ncd?.buy_up_ncd_if_selected || 0,
                premium_bef_gst: 0,
              },
            ],
          },
        ],
      },
    ],
  };
}
