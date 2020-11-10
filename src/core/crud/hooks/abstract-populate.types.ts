import { ExtractModel, ICrudHookContext } from "../crud.types";
import { AdapterService } from "@feathersjs/adapter-commons";

export type PopulateHookResolver<TService extends AdapterService<any>, TReturn> =
  (model: ExtractModel<TService>, context: ICrudHookContext<TService>) => Promise<TReturn> | TReturn;

export type PopulateHookResolvers<TService extends AdapterService<any>> = {
  [TProp in keyof ExtractModel<TService>]?: PopulateHookResolver<TService, ExtractModel<TService>[TProp]>;
};

declare module "@feathersjs/feathers" {
  interface Params {
    disablePopulateHooks?: boolean;
  }
}
