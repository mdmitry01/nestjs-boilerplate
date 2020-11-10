import { CrudServiceResult } from "../crud.types";
import { isPaginatedCrudServiceResult } from "./is-paginated-crud-service-result.util";

export const normalizeCrudServiceResult = <TModel>(result: CrudServiceResult<TModel>): TModel[]  => {
  if (Array.isArray(result)) {
    return result;
  }
  if (isPaginatedCrudServiceResult(result)) {
    return result.data;
  }
  return [result];
};
