import { Type } from "@nestjs/common";
import { AdapterService } from "@feathersjs/adapter-commons";
import { hooks } from "@feathersjs/hooks";
import { handleErrorsHook } from "./hooks/handle-errors.hook";
import { proxyArgumentsHook } from "./hooks/proxy-arguments.hook";
import { setDefaultArgumentsHook } from "./hooks/set-default-arguments.hook";
import { ServiceOptions } from "@feathersjs/adapter-commons/src/service";
import { DEFAULT_PAGINATION_OPTIONS } from "../../constants/pagination.constants";
import { getCrudMap } from "../../utils/get-crud-map.util";

const HOOK_MAP = getCrudMap([
  handleErrorsHook,
  proxyArgumentsHook,
  setDefaultArgumentsHook
]);

export const FeathersServiceAdapter = <T extends Type<AdapterService<any>>>(serviceClass: T): T => {
  // The returned class should have no name. That way the superclass's name gets inherited
  const childClass = class extends serviceClass {
    // A mixin class must have a constructor with a single rest parameter of type 'any[]'.
    // See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-mix-in-classes
    constructor(...args: any[]) {
      const options: Partial<ServiceOptions> = args[0] ?? {};
      args[0] = Object.assign({ paginate: DEFAULT_PAGINATION_OPTIONS }, options);
      super(...args);
    }
  };

  hooks(childClass, HOOK_MAP);
  return childClass;
};
