export interface IValidateCrudQueryPipeOptions {
  /**
   *  A list of additional non-standard query parameters to allow (e.g [ '$regex', '$populate' ])
   *  See https://docs.feathersjs.com/api/databases/common.html#options
   */
  operatorWhitelist?: string[];
}
