export type MaritalStatusType = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type GenderType = 'MALE' | 'FEMALE';
export interface QuoteResponse {
  message: string;
  data: Quote;
}
export interface Quote {
  id: number;
  quote_id: string;
  quote_no: string;
  policy_id: string;
  product_id: string;
  proposal_id: string;
  phone: string;
  email: string;
  name: string;
  data: QuoteData;
  partner_code: string;
  is_finalized: boolean;
  is_paid: boolean;
  is_sending_email: boolean;
  expiration_date: string; // ISO string date
  key: string;
  created_at: string; // ISO string date
  update_at: string; // ISO string date
  personal_info_id: string | null;
  company_id: number;
  payment_result_id: string | null;
  country_nationality_id: string | null;
  product_type_id: string | null;
  promo_code_id: string | null;
  promo_code: PromoCode | null;
  company: Company;
  country_nationality: any;
  product_type: any;
}
export interface Company {
  id: number;
  name: string;
}
export interface QuoteData {
  key?: string;
  plans?: Plan[];
  current_step: number;
  vehicles?: Vehicle[];
  personal_info?: PersonalInfo;
  vehicle_info_selected?: Vehicle;
  insurance_additional_info?: InsuranceAdditionalInfo;
  selected_plan?: string;
  selected_addons?: Record<string, string>;
  add_named_driver_info?: AddNamedDriverInfo[];
}
export interface AddNamedDriverInfo {
  name: string;
  gender: GenderType;
  nric_or_fin: string;
  date_of_birth: string;
  marital_status: MaritalStatusType;
  driving_experience: number;
}
export interface Plan {
  id: number;
  code: string;
  title: string;
  addons: Addon[];
  key_map: string;
  benefits: Benefit[]; // Benefits array is empty in the sample; adjust if needed.
  sub_title: string | null;
  created_at: string;
  updated_at: string;
  subtitle?: string;
  product_type: ProductType;
  is_recommended: boolean;
  premium_bef_gst: number;
  premium_with_gst: number;
}
export interface Benefit {
  id: number;
  name: string;
  is_active: boolean;
  order: number;
}
export interface Vehicle {
  vehicle_make: string;
  chasis_number: string;
  vehicle_model: string;
  first_registered_year: string;
  vehicle_number: string;
  chassis_no?: string;
  engine_no?: string;
  engine_number?: string;
}

export interface InsuranceAdditionalInfo {
  end_date: string;
  start_date: string;
  no_of_claim: number;
  no_claim_discount: number;
}
export interface PersonalInfo {
  name: string;
  nric: string;
  email: string;
  gender: string;
  address: string | string[];
  phone: string;
  date_of_birth: string;
  marital_status: string;
  driving_experience: number;
}
export interface ProductType {
  id: number;
  name: string;
}
export interface QuoteCreationPayload {
  key: string;
  partner_code: string;
  promo_code: string;
  company_id: number;
  personal_info: PersonalPayload;
  vehicle_info_selected: Vehicle;
  insurance_additional_info: InsuranceAdditionalInfo;
}

export interface ProposalPayload {
  key: string;
  selected_plan: string;
  selected_addons: Record<string, string>;
  add_named_driver_info: AddNamedDriverInfo[];
}

export interface QuoteInfo {
  product_id: string;
  policy_id: string;
  quote_no: string;
  proposal_id: string;
  quote_expiry_date: string;
  key: string;
  partner_code: string;
  partner_name: string;
  promo_code: string;
}

export interface Benefit {
  name: string;
  is_active: boolean;
}

export interface Addon {
  id: number;
  code: string;
  type: 'select' | 'checkbox'; // adjust as needed
  title: string;
  key_map: string | null;
  options: Option[];
  sub_title: string | null;
  is_display: boolean;
  description: string | null;
  is_recommended: boolean;
  premium_bef_gst: number;
  premium_with_gst: number;
  default_option_id: number | null;
}
export interface Option {
  id: number;
  label: string;
  value: string;
  key_map: string | null;
  description: string;
  dependencies: Dependency[];
  premium_bef_gst: number;
  premium_with_gst: number;
}

export interface Dependency {
  key_map: string;
  conditions: DependencyCondition[];
  premium_bef_gst: number;
  premium_with_gst: number;
}

export interface DependencyCondition {
  addon: DependencyAddon;
  value: string;
}

export interface DependencyAddon {
  id: number;
  code: string;
  title: string;
}

export interface PersonalPayload {
  name?: string;
  gender?: string;
  maritalStatus?: string;
  date_of_birth?: string;
  nric?: string;
  address?: string;
  driving_experience: number;
  phone: string;
  email: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  startTime: string;
  endTime: string;
  description: string;
  products: string[];
  isPublic: boolean;
  isShowCountdown: boolean;
  is_valid: boolean;
}
