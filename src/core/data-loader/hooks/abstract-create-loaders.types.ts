import * as DataLoader from "dataloader";

// This interface is supposed to be merged with other declarations.
// See https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDataLoaders {
}

declare module "../../hooks/hooks.types" {
  interface IHookContext<TSelf, TResult = any> {
    readonly loaders?: IDataLoaders;
  }
}

declare module "@feathersjs/feathers" {
  interface Params {
    readonly loaders?: IDataLoaders;
  }
}

export interface IDataLoadersMap {
  [name: string]: DataLoader<any, any>;
}
