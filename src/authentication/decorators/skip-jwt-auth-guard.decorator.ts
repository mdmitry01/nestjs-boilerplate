import { SKIP_JWT_AUTH_GUARD_METADATA } from "../authentication.constants";
import { SetMetadata } from "@nestjs/common";

export const SkipJwtAuthGuard = () => SetMetadata(SKIP_JWT_AUTH_GUARD_METADATA, true);
