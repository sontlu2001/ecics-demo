export interface LoginResponse {
  state: string;
  nonce: string;
  code_verifier: string;
  url: string;
}

export interface UserInfoPayload {
  nonce: string;
  code_verifier: string;
  state: string;
}

export interface SavePersonalInfoPayload {
  key: string;
  is_sending_email?: boolean;
  promo_code?: string;
  partner_code?: string;
  personal_info: {
    name: string;
    gender: string;
    marital_status: string;
    nric?: string;
    address: string[];
    date_of_birth: string;
    year_of_registration: string;
    driving_experience: string;
    phone: string;
    email: string;
  };
  vehicle_info_selected: {
    vehicle_number: string;
    first_registered_year: string;
    vehicle_make: string;
    vehicle_model: string;
    engine_number: string;
    chasis_number: string;
    engine_capacity: string;
    power_rate: string;
    year_of_manufacture: string;
  };
  vehicles: Vehicle[];
  shouldRedirect?: boolean;
}

export interface Vehicle {
  chasis_number: string;
  vehicle_make: string;
  vehicle_model: string;
  first_registered_year: string;
  vehicle_number: string;
}

export interface VehicleSingPassResponse {
  chassisno: { value: string };
  engineno: { value: string };
  firstregistrationdate: { value: string };
  make: { value: string };
  model: { value: string };
  vehicleno: { value: string };
  yearofmanufacture: { value: string };
  enginecapacity: { value: number };
  powerrate: { value: number };
}

export interface VehicleMakeResponse {
  message: string;
  data: {
    id: string;
    name: string;
    group_name: string;
  }[];
}
export interface VehicleModelResponse {
  message: string;
  data: {
    id: string;
    name: string;
  }[];
}

export interface VehicleCheckResponse {
  message: string;
  data?: {
    id: number;
    name: string;
    vehicle_make: {
      id: number;
      name: string;
    };
  };
}

export interface ClassInfo {
  class: {
    value: string;
  };
  issuedate: {
    value: string;
  };
}
