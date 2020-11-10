import { IsUUID } from "class-validator";

export class AddEventParticipantsDto {
  @IsUUID()
  userId: string;
}
