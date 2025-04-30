export interface QuoteResponse {
  message: string;
  data: {
    quote_info: QuoteInfo;
    plans: Plan[];
  };
}

export interface QuoteCreationPayload {
  key: string;
  partner_code: string;
  promo_code: string;
  company_id: number;
  personal_info: PersonalInfo;
  vehicle_basic_details: VehicleBasicDetails;
  insurance_additional_info: InsuranceAdditionalInfo;
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

export interface Condition {
  addon_id: string;
  value: boolean;
}

export interface Dependency {
  conditions: Condition[];
  premium_with_gst: number;
  premium_bef_gst: number;
}

export interface Option {
  id: string;
  label: string;
  description: string;
  value: string;
  dependencies: Dependency[];
  premium_with_gst: number;
  premium_bef_gst: number;
}

export interface Addon {
  id: string;
  title: string;
  type: 'with_options' | 'without_options';
  is_display: boolean;
  is_recommended: boolean;
  description: string;
  default_option_id: string | null;
  depends_on?: string[];
  options: Option[];
}

export interface Plan {
  id: string;
  title: string;
  subtitle: string;
  benefits: Benefit[];
  is_recommended: boolean;
  premium_with_gst: number;
  premium_bef_gst: number;
  addons: Addon[];
}

export interface QuoteData {
  quote_info: QuoteInfo;
  plans: Plan[];
}

export interface PersonalInfo {
  name?: string;
  gender?: string;
  maritalStatus?: string;
  date_of_birth?: string;
  nric?: string;
  address?: string;
  driving_experience: number;
  phone_number: string;
  email: string;
}

export interface VehicleBasicDetails {
  make: string;
  model: string;
  first_registered_year: string;
  chasis_number: string;
}

export interface InsuranceAdditionalInfo {
  no_claim_discount: number;
  no_of_claim: number;
  start_date: string;
  end_date: string;
}
