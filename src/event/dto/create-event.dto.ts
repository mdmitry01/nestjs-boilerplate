import { IsOptional, IsUUID, MaxLength } from "class-validator";
import { DEFAULT_STRING_MAX_LENGTH } from "../../core/validation/validation.constants";

export class CreateEventDto {
  @IsUUID()
  calendarId: string;

  @MaxLength(DEFAULT_STRING_MAX_LENGTH)
  title: string;

  @MaxLength(DEFAULT_STRING_MAX_LENGTH)
  @IsOptional()
  description?: string;
}
