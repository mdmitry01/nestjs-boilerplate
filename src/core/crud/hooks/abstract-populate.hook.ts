import { IHook } from "../../hooks/hooks.types";
import { NextFunction } from "@feathersjs/hooks";
import { ExtractModel, ICrudHookContext } from "../crud.types";
import { PopulateHookResolvers } from "./abstract-populate.types";
import { normalizeCrudServiceResult } from "../utils/normalize-crud-service-result.util";
import { AdapterService } from "@feathersjs/adapter-commons";

export abstract class AbstractPopulateHook<T extends AdapterService<any>> implements IHook<T> {
  protected readonly abstract resolvers: PopulateHookResolvers<T>;

  async process(context: ICrudHookContext<T>, next: NextFunction): Promise<void> {
    if (context.args.params.disablePopulateHooks) {
      return next();
    }
    await next();

    const propertyNames = Object.keys(this.resolvers) as (keyof ExtractModel<T>)[];
    const normalizedResult = normalizeCrudServiceResult(context.result);

    const promises = propertyNames.map(async propertyName => {
      const resolver = this.resolvers[propertyName];
      await Promise.all(normalizedResult.map(async resultItem => {
        resultItem[propertyName] = await resolver(resultItem, context);
      }));
    });
    await Promise.all(promises);
  }
}
