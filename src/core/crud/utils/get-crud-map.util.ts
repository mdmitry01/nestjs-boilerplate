import { HookClass, HookClassMap, IHookContext } from "../../hooks/hooks.types";
import { AdapterService } from "@feathersjs/adapter-commons";
import { HookMap } from "@feathersjs/hooks/lib/object";
import { Middleware } from "@feathersjs/hooks";

const CRUD_METHOD_NAMES = [
  "find",
  "get",
  "create",
  "update",
  "patch",
  "remove"
] as const;

export function getCrudMap<T extends AdapterService<any>>(hookClasses: HookClass<T>[]): HookClassMap<T>;
export function getCrudMap<T extends AdapterService<any>>(hookFunctions: Middleware<IHookContext<T>>[]): HookMap<T>;
export function getCrudMap<T extends AdapterService<any>>(hookClassesOrFunctions: HookClass<T>[] | Middleware<IHookContext<T>>[]): HookClassMap<T> | HookMap<T> {
  const hookMap: HookClassMap<AdapterService<any>> | HookMap<AdapterService<any>> = {};
  CRUD_METHOD_NAMES.forEach(methodName => {
    // TODO: do not copy the hookClassesOrFunctions array (remove `.slice()`)
    //  when this issue https://github.com/feathersjs/hooks/issues/60 is resolved
    hookMap[methodName] = hookClassesOrFunctions.slice();
  });
  return hookMap;
}
