import { ServiceOptions } from "@feathersjs/adapter-commons";

export const DEFAULT_PAGINATION_OPTIONS: ServiceOptions["paginate"] = {
  max: 100,
  default: 100
};
