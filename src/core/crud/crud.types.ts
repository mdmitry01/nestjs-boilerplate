import { NullableId, Paginated, Params, Query } from "@feathersjs/feathers";
import { IHookContext } from "../hooks/hooks.types";
import { AdapterService } from "@feathersjs/adapter-commons";

export type CrudServiceResult<T> = T[] | Paginated<T> | T;

export interface ICrudServiceArgs<TModel> {
  params: Params;
  id?: NullableId;
  data?: Partial<TModel> | Partial<TModel>[];
  readonly normalizedData?: Partial<TModel>[];
}

export type ExtractModel<T extends AdapterService<any>> = Parameters<T["update"]>[1];

export interface ICrudHookContext<T extends AdapterService<any>> extends IHookContext<T, CrudServiceResult<ExtractModel<T>>> {
  args: ICrudServiceArgs<ExtractModel<T>>;
}

export interface ICrudQuerySort {
  [key: string]: -1 | 1;
}

export interface ICrudQueryConditions {
  $in?: any[];
  $nin?: any[];
  $lt?: any;
  $lte?: any;
  $gt?: any;
  $gte?: any;
  $ne?: any;

  [key: string]: any;
}

export type CrudQuery = Query;

declare module "@feathersjs/feathers" {
  // See the docs https://docs.feathersjs.com/api/databases/querying.html
  interface Query {
    $limit?: number;
    $skip?: number;
    $sort?: ICrudQuerySort;
    $select?: string[];
    $or?: ICrudQueryConditions[];
  }
}
