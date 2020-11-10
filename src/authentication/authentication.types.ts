import { PartialUser } from "../user/user.types";

export interface ITokenPayload {
  sub: string;
  email: string;
}

export interface ISignInResult {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
}

declare module "express" {
  interface Request {
    readonly user?: PartialUser;
  }
}
