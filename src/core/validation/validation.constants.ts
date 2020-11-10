import { ValidatorOptions } from "class-validator";

// TODO add `stopAtFirstError: true` when the feature is released
export const DEFAULT_VALIDATION_OPTIONS: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  skipMissingProperties: false,
  validationError: {
    target: false
  }
};

export const DEFAULT_STRING_MAX_LENGTH = 1500;
