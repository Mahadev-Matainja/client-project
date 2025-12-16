export interface AmbulanceType {
  id: number;
  owner_name: string;
  ambulance_name: string;
  ambulance_no: string;
  car_model: string;
  phone: string;
  alt_phone?: string;
  email: string;
  address: string;
  type: string;
}

export interface AmbulanceList {
  id: number;
  name: string;
  type: string;
  phone: string;
  address: string;
  availability: boolean;
  vehicle: string;
  lastUpdated: string;
  ambulance_no: string;
  alt_phone: string;
  image: string;
  verified: boolean;
  status: boolean;
}

//ambulance form

export interface AmbulanceForm {
  car_model: string;
  reg_name: string;
  reg_ambulance_no: string;
  reg_phone: string;
  alternative_phone: string;
  address_line1: string;
  address_line2: string;
  landmark: string;
  state_id: string;
  district_id: string;
  city_id: string;
  pincode: string;
  latitude: string;
  longitude: string;
  additional_text: string;
  is_verified: string | number;
  is_available: string | number;
  status: string | number;
  ambulance_typeId: string;
  ac: string | number;
  oxygen_cylinder: string | number;
  first_aid_kit: string | number;
  suction_apparatus: string | number;
  portable_stretcher: string | number;
  cardiac_monitor: string | number;
  ventilator: string | number;
  infusion_pumps: string | number;
  nebulizer: string | number;
  multi_parameter_monitor: string | number;
  transport_ventilator: string | number;
  emergency_drugs_cabinet: string | number;
  image: file;
}
