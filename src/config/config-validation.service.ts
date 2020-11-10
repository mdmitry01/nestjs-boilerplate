import { validateSync, ValidationError, ValidatorOptions } from "class-validator";
import { Type } from "@nestjs/common";
import { IValidationResult } from "./config-validation.types";
import { plainToClass } from "class-transformer";
import { DEFAULT_VALIDATION_OPTIONS } from "../core/validation/validation.constants";

export class ConfigValidationService<T> {
  private static readonly ERROR_MESSAGE_SEPARATOR = "; ";

  constructor(private readonly validationSchemaClass: Type<T>) {
  }

  private generateErrorMessage(validationErrors: ValidationError[]) {
    return validationErrors
      .map(error => Object.values(error.constraints).join(ConfigValidationService.ERROR_MESSAGE_SEPARATOR))
      .join(ConfigValidationService.ERROR_MESSAGE_SEPARATOR);
  }

  validate(object: Record<string, any>, validatorOptions?: ValidatorOptions): IValidationResult<T> {
    const instance = plainToClass(this.validationSchemaClass, object);
    const errors = validateSync(instance, {
      ...DEFAULT_VALIDATION_OPTIONS,
      forbidNonWhitelisted: false,
      ...validatorOptions
    });
    if (!errors.length) {
      return { value: instance };
    }
    const errorMessage = this.generateErrorMessage(errors);
    return {
      value: instance,
      error: new Error(errorMessage)
    };
  }
}
