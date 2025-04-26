export const CAR_INSURANCE_PLANS = {
  COM: {
    ID: 'COM',
    TITLE: 'Comprehensive',
    BENEFITS: [
      {
        name: '<p>Third-Party liability coverage relating to vehicle charging</p>',
        is_active: true,
      },
      {
        name: '<p>Free NCD Protector (from 10%) & Waiver of Excess</p>',
        is_active: true,
      },
      {
        name: '<p>Up to $50,000 complimentary Personal Accident coverage</p>',
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
    ADD_ONS: {
      ANY_WORKSHOP: {
        ID: 'ANW',
        KEY_MAP: 'any_workshop',
        TITLE: 'Any Workshops',
        TYPE: 'without_options',
        DESCRIPTION:
          "Enjoy the flexibility to repair your car at any specific dealer's workshop or workshop of your choice.* a minimum of $1,500 excess apply.*",
        premium_with_gst: 0,
        premium_bef_gst: 0,
      },
      LOSS_OF_USE: {
        ID: 'loss_of_use',
        KEY_MAP: 'loss_of_use',
        TITLE: 'Loss of Use',
        TYPE: 'without_options',
        IS_DISPLAY: false,
        DESCRIPTION:
          'Compensates you with Transport Allowance or Courtesy Car when your car is being repaired due to an accident.',
        DEFAULT_OPTION: 'SGD750',
        DEPENDS_ON: ['ANW'],
        OPTIONS: {
          SGD750: {
            ID: 'SGD750',
            label: '$750',
            value: 'YES (up to 1,600cc)',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
          courtesy_car_up_to_2000cc: {
            id: 'courtesy_car_up_to_2000cc',
            label: 'Courtesy Car (up to 2,000cc)',
            value: 'YES (up to 2,000cc)',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
        },
      },
      medical_expenses: {
        id: 'medical_expenses',
        label: 'Medical Expenses',
        is_active: true,
        description:
          'Enjoy additional coverage to your basic policy coverage for the policy owner and/or Named Driver who is driving the motor car at the point of accident.You may enjoy additional coverage by selecting one of the options.',
        default_option: null,
        options: {
          $200: {
            id: '$200',
            label: '$200',
            value: 'YES (+SGD 200)',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
          $700: {
            id: '$700',
            label: '$700',
            value: 'YES (+SGD 700)',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
          $1700: {
            id: '$1,700',
            label: '$1,700',
            value: 'YES (+SGD 1700)',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
        },
      },
      key_replacement_cover: {
        id: 'key_replacement_cover',
        label: 'Key Replacement Cover',
        is_active: true,
        description:
          'Enjoy reimbursement on the replacement of your motor car keys which are lost as a result of Theft, Robbery or an Accident.',
        default_option: null,
        options: {
          $300: {
            id: '$300',
            label: '$300 Cover',
            value: 'YES (SGD 300)',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
          $500: {
            id: '$500 Cover',
            label: '$500',
            value: 'YES (SGD 500)',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
        },
      },
      addl_named_drivers: {
        id: 'addl_named_drivers',
        label: 'Add Additional Named Driver(s)',
        is_active: true,
        description:
          'Extend the coverage to any driver you choose to name under your policy.',
        default_option: null,
        options: {
          $drivers_age_from_27_to_70: {
            id: 'drivers_age_from_27_to_70',
            label: 'Experienced drivers age between 27 to 70',
            value: 'YES',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
          $all_drivers: {
            id: 'all_drivers',
            label: 'Experienced & Inexperienced drivers of all age',
            value: 'YES',
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
        },
      },
      buy_up_ncd: {
        id: 'buy_up_ncd',
        label: 'Boost your NCD to 50%.',
        is_active: true,
        description: 'Boost your NCD to 50%.',
        price_rules: {
          selected_any_workshop: {
            condition: { addon_id: 'any_workshop', option_id: true },
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
          not_selected_any_workshop: {
            condition: { addon_id: 'any_workshop', option_id: false },
            premium_with_gst: 0,
            premium_bef_gst: 0,
          },
        },
      },
    },
  },
  TPFT: {
    id: 'TPFT',
    title: 'Third Party Fire and Theft',
    benefits: [
      {
        name: 'Up to S$10,000 Personal Accident Coverage',
        is_active: true,
      },
      {
        name: 'Third-Party liability coverage relating to vehicle charging',
        is_active: true,
      },
      {
        name: 'Free NCD Protector (from 10%) & Waiver of Excess',
        is_active: true,
      },
    ],
  },
  TPO: {
    id: 'TPO',
    title: 'Third Party Only',
    benefits: [
      {
        name: 'Up to S$10,000 Personal Accident Coverage',
        is_active: true,
      },
      {
        name: 'Third-Party liability coverage relating to vehicle charging',
        is_active: true,
      },
    ],
  },
};
