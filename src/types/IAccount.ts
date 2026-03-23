type roles = "super admin" | "admin" | "editor";

export interface IAccount {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  username: string;
  role: roles;
}

export const apiKey = "dtj6ret6lqdbpzqeffnhuerx13dudy4nmnu2t1loe2q2z17a";
