import type { Request } from "express";

export type TokenData = {
  resumeStep: any;
  user(user: any): string;
  needsToCompleteRegistration: any;
  userExists: boolean;

  accessToken: string;
  refreshToken: string;
  expiresAt: Date
}

export interface RequestWithUser extends Request {
  user: DataStoreInToken;
}

export type IUser = {
  id?: number;
  email: string;
  password: string;
  role: string;
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DataStoreInToken = {
  id: number,
  email: string,
  role: string,
  fullName: string,
}

export type IUserSignUp = {
  email: string;
  password: string;
  role: string;
  fullName: string;
  cellphone: string
  
}


export type IUserLogin = {
  email: string;
  password: string
}

export interface IDecodedJWT {
  id: string;
  email: string;
  fullName: string;
  role: string;
}