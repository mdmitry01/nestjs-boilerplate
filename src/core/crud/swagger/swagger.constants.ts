import { ApiQueryOptions } from "@nestjs/swagger";

export const API_LIMIT_OPTIONS: ApiQueryOptions = {
  name: "$limit",
  type: "integer",
  description: "`$limit` will return only the number of results you specify",
  required: false
};

export const API_SKIP_OPTIONS: ApiQueryOptions = {
  name: "$skip",
  type: "integer",
  description: "`$skip` will skip the specified number of results",
  required: false
};

export const API_SORT_OPTIONS: ApiQueryOptions = {
  name: "$sort",
  type: "object",
  description: "`$sort` will sort based on the object you provide. " +
    "It can contain a list of properties by which to sort mapped to the order (`1` ascending, `-1` descending)",
  required: false,
  style: "deepObject"
};

// TODO: `$or` operator doesn't work correctly in Swagger.
//  Swagger serializes `$or` array to an object.
export const API_QUERY_OPTIONS: ApiQueryOptions = {
  name: "query",
  type: "object",
  description: "See the [docs](https://docs.feathersjs.com/api/databases/querying.html)",
  required: false,
  style: "form",
  explode: true
};
