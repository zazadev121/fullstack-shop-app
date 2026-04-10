export interface LoginDTO {
  email?: string;
  password?: string;
}

export interface RegisterDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface VerifyEmailDTO {
  email?: string;
  verifyCode?: string;
}

export interface ResetPassDTO {
  email?: string;
  resetCode?: string;
  newPassword?: string;
}

export interface AuthResponse {
  token: string;
}
