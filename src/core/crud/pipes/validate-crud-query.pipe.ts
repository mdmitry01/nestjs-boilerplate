import { PipeTransform, Injectable, Optional, BadRequestException } from "@nestjs/common";
import { filterQuery } from "@feathersjs/adapter-commons";
import { IValidateCrudQueryPipeOptions } from "./validate-crud-query.types";
import { BadRequest } from "@feathersjs/errors";
import { CrudQuery } from "../crud.types";

@Injectable()
export class ValidateCrudQueryPipe<T extends CrudQuery = any> implements PipeTransform<T> {
  private readonly operatorWhitelist: IValidateCrudQueryPipeOptions["operatorWhitelist"];

  constructor(@Optional() options: IValidateCrudQueryPipeOptions = {}) {
    this.operatorWhitelist = options.operatorWhitelist ?? [];
  }

  transform(query: T): T {
    try {
      filterQuery(query, {
        operators: this.operatorWhitelist
        // filters: this.filters,
        // paginate: false
      });
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
    return query;
  }
}
