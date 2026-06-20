export interface IStaff {
  firstName: string;
  lastName: string;
  email: string;
  //password: string;
  phone?: string;
  role: string;
  //subject?: string;
  employeeId?: string;
  address?: string;
  mustChangePassword: boolean;
}
