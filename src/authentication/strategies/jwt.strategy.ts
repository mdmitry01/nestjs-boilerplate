import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "../../config/environment-variables.class";
import { ITokenPayload } from "../authentication.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<EnvironmentVariables>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("SECRET")
    });
  }

  async validate(payload: ITokenPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
