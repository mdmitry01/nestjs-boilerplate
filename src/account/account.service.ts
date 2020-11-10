import { Injectable } from "@nestjs/common";
import { PartialUser } from "../user/user.types";
import { IProfile } from "./account.types";

@Injectable()
export class AccountService {
  getProfile(user: PartialUser): IProfile {
    return {
      id: user.id,
      email: user.email
    };
  }
}
