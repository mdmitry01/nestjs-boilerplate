import { IHook, IHookContext } from "../../hooks/hooks.types";
import { NextFunction } from "@feathersjs/hooks";
import { IDataLoadersMap } from "./abstract-create-loaders.types";
import { AdapterService } from "@feathersjs/adapter-commons";

export abstract class AbstractCreateLoadersHook<TSelf = any, TResult = any> implements IHook<TSelf, TResult> {
  protected abstract createDataLoaders(context: IHookContext<TSelf, TResult>): Promise<IDataLoadersMap> | IDataLoadersMap;

  async process(context: IHookContext<TSelf, TResult>, next: NextFunction): Promise<void> {
    if (!("loaders" in context)) {
      (context as any).loaders = {};
    }
    const dataLoaders = await this.createDataLoaders(context);

    Object
      .keys(dataLoaders)
      .forEach(dataLoaderName => {
        if (dataLoaderName in context.loaders) {
          throw new Error(`Data loader ${dataLoaderName} is already defined in context.loaders`);
        }
        (context.loaders as any)[dataLoaderName] = dataLoaders[dataLoaderName];
      });

    if (context.self instanceof AdapterService) {
      const { args } = context;
      args.params = {
        ...args.params,
        loaders: context.loaders
      };
    }

    await next();
  }
}
