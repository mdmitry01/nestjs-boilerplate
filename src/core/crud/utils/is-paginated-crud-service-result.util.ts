import { CrudServiceResult } from "../crud.types";
import { Paginated } from "@feathersjs/feathers";

export const isPaginatedCrudServiceResult = <TModel>(result: CrudServiceResult<TModel>): result is Paginated<TModel> => {
  return "total" in result &&
    "limit" in result &&
    "skip" in result &&
    Array.isArray(result.data);
};
