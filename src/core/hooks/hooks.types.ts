import { HookContext, NextFunction } from "@feathersjs/hooks";
import { Type } from "@nestjs/common";
import { AllowedNames } from "../types/utility.types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHookContext<TSelf, TResult = any> extends HookContext<TResult, TSelf> {
}

export interface IHook<TSelf, TResult = any> {
  process(context: IHookContext<TSelf, TResult>, next: NextFunction): Promise<void>;
}

export type HookClass<TSelf = any, TResult = any> = Type<IHook<TSelf, TResult>>;

export type HookClassMap<T> = {
  // generic `T` argument should prevent mistakes when
  // a hook with specific generic argument is applied to the wrong service
  [TFunc in AllowedNames<T, (...args: any[]) => any>]?: HookClass<T>[];
};

declare module "@feathersjs/feathers" {
  interface Params {
    disableHooks?: boolean;
  }
}
