import { Params, Query } from "@feathersjs/feathers";

export const addToQuery = <TParams extends Params, TQuery extends Query>(params: TParams, query: TQuery) => {
  return {
    ...params,
    query: {
      ...params.query,
      ...query
    }
  };
};
