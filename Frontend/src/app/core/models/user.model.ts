export enum UserRoles {
  Admin = 0,
  User = 1
}

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  role: UserRoles;
}
