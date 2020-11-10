import { AdapterService } from "@feathersjs/adapter-commons";
import * as DataLoader from "dataloader";
import { DefaultKey } from "../data-loader.types";
import { normalizeResults } from "../../../data-loader/utils/normalize-results.util";
import { Params } from "@feathersjs/feathers";

export const existenceLoaderFactory = <TValue extends Record<any, any>, TKeyName extends keyof TValue = DefaultKey<TValue>>(
  service: AdapterService<TValue>,
  user: Params["user"],
  keyName: TKeyName = "id" as TKeyName
): DataLoader<TValue[typeof keyName], boolean> => {
  return new DataLoader(async ids => {
    const values = await service.find({
      user,
      paginate: false,
      disablePopulateHooks: true,
      query: {
        $select: [keyName as string],
        [keyName]: { $in: ids }
      }
    }) as TValue[];
    return normalizeResults(values, ids, keyName, (key, resultMap) => {
      return resultMap.has(key);
    });
  });
};
