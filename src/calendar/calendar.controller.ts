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
import { CalendarService } from "./calendar.service";
import { CreateCalendarDto } from "./dto/create-calendar.dto";
import { UpdateCalendarDto } from "./dto/update-calendar.dto";
import { Calendar } from "./calendar.model";
import { ValidateCrudQueryPipe } from "../core/crud/pipes/validate-crud-query.pipe";
import { CrudQuery } from "../core/crud/crud.types";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CrudApiQuery } from "../core/crud/swagger/decorators/crud-api-query.decorator";
import { Request } from "express";

// TODO: code generation for controllers
@Controller("calendars")
@ApiTags("calendars")
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {
  }

  @Post()
  @ApiResponse({ status: 201, type: Calendar })
  create(@Req() { user }: Request, @Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto, { user });
  }

  @Get()
  @CrudApiQuery()
  @ApiResponse({ status: 200, type: [Calendar] })
  find(@Req() { user }: Request, @Query(ValidateCrudQueryPipe) query: CrudQuery) {
    return this.calendarService.find({ user, query });
  }

  @Get(":id")
  get(@Req() { user }: Request, @Param("id", ParseUUIDPipe) id: string) {
    return this.calendarService.get(id, { user });
  }

  @Patch(":id")
  @ApiResponse({ status: 200, type: Calendar })
  patch(
    @Req() { user }: Request,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCalendarDto: UpdateCalendarDto
  ) {
    return this.calendarService.patch(id, updateCalendarDto, { user });
  }

  @Delete(":id")
  @ApiResponse({ status: 200, type: Calendar })
  remove(@Req() { user }: Request, @Param("id", ParseUUIDPipe) id: string) {
    return this.calendarService.remove(id, { user });
  }
}
