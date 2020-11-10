import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "../authentication.service";
import { User } from "../../user/user.model";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(private readonly authService: AuthenticationService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      return await this.authService.validateUser(email, password);
    } catch (error) {
      this.logger.warn(`Failed sign-in attempt using email ${email}. Reason: ${error.message}`);
      throw error;
    }
  }
}
