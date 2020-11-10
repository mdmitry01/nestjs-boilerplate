import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { SKIP_JWT_AUTH_GUARD_METADATA } from "../authentication.constants";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const skipJwtAuthGuard = this.reflector.get<boolean>(SKIP_JWT_AUTH_GUARD_METADATA, context.getHandler());
    if (skipJwtAuthGuard) {
      return true;
    }
    return super.canActivate(context);
  }
}
