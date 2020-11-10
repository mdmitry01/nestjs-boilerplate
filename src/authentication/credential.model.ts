import { BaseModel } from "../database/base.model";

export class Credential extends BaseModel {
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  userId: string;

  static idColumn = "refreshToken";
}
