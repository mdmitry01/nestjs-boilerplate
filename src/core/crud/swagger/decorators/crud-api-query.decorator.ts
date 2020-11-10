import { ApiQuery } from "@nestjs/swagger";
import { API_LIMIT_OPTIONS, API_QUERY_OPTIONS, API_SKIP_OPTIONS, API_SORT_OPTIONS } from "../swagger.constants";

export const CrudApiQuery = (): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    ApiQuery(API_LIMIT_OPTIONS)(target, propertyKey, descriptor);
    ApiQuery(API_SKIP_OPTIONS)(target, propertyKey, descriptor);
    ApiQuery(API_SORT_OPTIONS)(target, propertyKey, descriptor);
    ApiQuery(API_QUERY_OPTIONS)(target, propertyKey, descriptor);
  };
};
