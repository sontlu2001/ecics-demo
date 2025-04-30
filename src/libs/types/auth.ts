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

export interface Vehicle {
  vehicleno: {
    value: string;
  };
  chassisno: {
    value: string;
  };
  engineno?: {
    value: string;
  };
  make: {
    value: string;
  };
  model: {
    value: string;
  };
}

export interface SavePersonalInfoPayload {
  email: string;
  phone: string;
  name: string;
  nric: string;
  gender: string;
  marital_status: string;
  date_of_birth: string;
  address: string;
  vehicle_make: string;
  vehicle_model: string;
  year_of_registration: string;
  vehicles: Vehicle[];
  key: string;
}
