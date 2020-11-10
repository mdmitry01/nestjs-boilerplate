import { IsOptional, IsString } from "class-validator";

export class TerminateAllOtherSessionsDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
