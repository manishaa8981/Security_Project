// src/interfaces/auth/IAuth.ts

export interface LoginCredentials {
  user_name: string;
  password: string;
}
export interface RegistrationCredentials {
  full_name: string;
  user_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface ResetCredentials {
  token: string;
  password: string;
}

