import { Plan, ReviewInfo } from './quote';

export interface MaidQuoteResponse {
  message: string;
  data: any;
}

export interface MaidQuoteCreationPayload {
  key: string;
  maid_type: string;
  plan_period: string;
  start_date: string;
  promo_code: string;
  partner_code: string;
  personal_info: MaidPersonalInfo;
  maid_info: MaidInfo;
}

export interface MaidQuote {
  id: number;
  quote_id: string;
  quote_no: string;
  policy_id: string;
  product_id: string;
  proposal_id: string;
  payment_id: string;
  phone: string;
  email: string;
  name: string;
  data: MaidQuoteData;
  partner_code: string;
  is_finalized: boolean;
  is_paid: boolean;
  is_sending_email: boolean;
  is_electric_model: boolean;
  expiration_date: string;
  key: string;
  company_name_other?: string;
  created_at: string;
  updated_at: string;
  personal_info_id: string | null;
  company_id: number;
  payment_result_id: string | null;
  country_nationality_id: string | null;
  product_type_id: number | null;
  promo_code_id: string | null;
  promo_code: any | null;
  end_date: string;
}

export interface MaidQuoteData {
  plans?: Plan[];
  personal_info: MaidPersonalInfo;
  maid_info: MaidInfo;
  insurance_other_info: InsuranceOtherInfo;
  selected_plan: string;
  selected_addons?: Record<string, string>;
  review_info_premium?: ReviewInfo;
}

export interface MaidInfo {
  nationality: string;
  date_of_birth: string;
  name: string;
  fin: string;
  passport_number: string;
  company_name: string;
  company_name_other: string;
  has_helper_worked_12_months: string;
}

export interface InsuranceOtherInfo {
  end_date: string;
  maid_type: string;
  start_date: string;
  plan_period: string;
}

export interface MaidPersonalInfo {
  name: string;
  nric: string;
  email: string;
  gender: string;
  address: string | string[];
  phone: string;
  date_of_birth: string;
  marital_status: string;
  post_code: string;
  nationality: string;
}
