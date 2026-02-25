type roles = "super admin" | "admin" | "editor";

export interface IAccount {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  username: string;
  role: roles;
}
