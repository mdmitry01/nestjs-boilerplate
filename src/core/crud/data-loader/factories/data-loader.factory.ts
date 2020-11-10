import { AdapterService } from "@feathersjs/adapter-commons";
import * as DataLoader from "dataloader";
import { normalizeResults } from "../../../data-loader/utils/normalize-results.util";
import { DefaultKey } from "../data-loader.types";
import { Params } from "@feathersjs/feathers";

export const dataLoaderFactory = <TValue extends Record<any, any>, TKeyName extends keyof TValue = DefaultKey<TValue>>(
  service: AdapterService<TValue>,
  user: Params["user"],
  keyName: TKeyName = "id" as TKeyName
): DataLoader<TValue[typeof keyName], TValue> => {
  return new DataLoader(async ids => {
    const values = await service.find({
      user,
      paginate: false,
      query: { [keyName]: { $in: ids } }
    }) as TValue[];
    return normalizeResults(values, ids);
  });
};
