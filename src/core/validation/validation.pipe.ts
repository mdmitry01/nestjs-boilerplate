import { Optional, ValidationPipe as NestValidationPipe, ValidationPipeOptions } from "@nestjs/common";
import { DEFAULT_VALIDATION_OPTIONS } from "./validation.constants";

export class ValidationPipe extends NestValidationPipe {
  constructor(@Optional() options: ValidationPipeOptions = {}) {
    super({
      ...DEFAULT_VALIDATION_OPTIONS,
      transform: true,
      ...options
    });
  }
}
