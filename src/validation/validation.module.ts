import { Module } from "@nestjs/common";
import { ValidationPipe } from "../core/validation/validation.pipe";
import { APP_PIPE } from "@nestjs/core";

@Module({
  providers: [{
    provide: APP_PIPE, // global pipe
    useClass: ValidationPipe
  }]
})
export class ValidationModule {
}
