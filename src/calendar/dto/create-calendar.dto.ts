import { IsOptional, MaxLength } from "class-validator";
import { DEFAULT_STRING_MAX_LENGTH } from "../../core/validation/validation.constants";

export class CreateCalendarDto {
  @MaxLength(DEFAULT_STRING_MAX_LENGTH)
  name: string;

  @MaxLength(DEFAULT_STRING_MAX_LENGTH)
  @IsOptional()
  description?: string;
}
