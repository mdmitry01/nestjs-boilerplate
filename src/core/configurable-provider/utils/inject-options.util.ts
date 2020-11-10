import { Type } from "@nestjs/common";
import { IConfigurable } from "../configurable-provider.types";

export const injectOptions = <T extends Type<IConfigurable>>(clazz: T, options: Parameters<InstanceType<T>["setOptions"]>[0]): T => {
  return new Proxy(clazz, {
    construct(target, args) {
      const targetInstance = new target(...args);
      targetInstance.setOptions(options);
      return targetInstance;
    }
  });
};
