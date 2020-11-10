import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseUUIDPipe,
  Req
} from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./event.model";
import { ValidateCrudQueryPipe } from "../core/crud/pipes/validate-crud-query.pipe";
import { CrudQuery } from "../core/crud/crud.types";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../user/user.model";
import { CrudApiQuery } from "../core/crud/swagger/decorators/crud-api-query.decorator";
import { AddEventParticipantsDto } from "./dto/add-event-participants.dto";
import { Request } from "express";

@Controller("events")
@ApiTags("events")
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {
  }

  @Post()
  @ApiResponse({ status: 201, type: Event })
  create(@Req() { user }: Request, @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto, { user });
  }

  @Get()
  @CrudApiQuery()
  @ApiResponse({ status: 200, type: [Event] })
  find(@Req() { user }: Request, @Query(ValidateCrudQueryPipe) query: CrudQuery) {
    return this.eventService.find({ user, query });
  }

  @Get(":id")
  get(@Req() { user }: Request, @Param("id", ParseUUIDPipe) id: string) {
    return this.eventService.get(id, { user });
  }

  @Patch(":id")
  @ApiResponse({ status: 200, type: Event })
  patch(
    @Req() { user }: Request,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto
  ) {
    return this.eventService.patch(id, updateEventDto, { user });
  }

  @Delete(":id")
  @ApiResponse({ status: 200, type: Event })
  remove(@Req() { user }: Request, @Param("id", ParseUUIDPipe) id: string) {
    return this.eventService.remove(id, { user });
  }

  @Get(":eventId/participants")
  @CrudApiQuery()
  @ApiResponse({ status: 200, type: [User] })
  findParticipants(
    @Req() { user }: Request,
    @Query(ValidateCrudQueryPipe) query: CrudQuery,
    @Param("eventId", ParseUUIDPipe) eventId: string
  ) {
    return this.eventService.findParticipants(eventId, { user, query });
  }

  @Post(":eventId/participants")
  @ApiResponse({ status: 201 })
  async addParticipants(
    @Req() { user }: Request,
    @Body() addEventParticipantsDto: AddEventParticipantsDto,
    @Param("eventId", ParseUUIDPipe) eventId: string
  ) {
    return this.eventService.addParticipant(
      { eventId, userId: addEventParticipantsDto.userId },
      user
    );
  }

  @Delete(":eventId/participants/:userId")
  @ApiResponse({ status: 200 })
  async removeParticipants(
    @Req() { user }: Request,
    @Param("eventId", ParseUUIDPipe) eventId: string,
    @Param("userId", ParseUUIDPipe) userId: string
  ) {
    return this.eventService.removeParticipant(
      { eventId, userId },
      user
    );
  }
}
