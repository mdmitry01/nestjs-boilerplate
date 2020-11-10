import { hooks as feathersHooks, Middleware } from "@feathersjs/hooks";
import { HookClass, HookClassMap, IHook, IHookContext } from "./hooks.types";
import { Inject, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { HOOKS_CONTAINER_SYMBOL, MODULE_REF_SYMBOL } from "./hooks.contants";
import { HookMap } from "@feathersjs/hooks/lib/object";
import { ICrudHookContext } from "../crud/crud.types";

// If we don't return a constructor function from `@Hooks` decorator
// and the generic type for `@Hooks<GenericType>` isn't specified,
// TypeScript won't force you to specify it, and `@Hooks` will accept any arguments as valid.
// To fix this, we must return the constructor function from `@Hooks` decorator.
type GenericClassDecorator<T extends Type<any>> = (target: T) => T;

const getHookInstance = async <T extends IHook<any>>(context: IHookContext<any>, hookClass: Type<T>): Promise<T> => {
  let hooksContainer: Map<Type<IHook<any>>, IHook<any>> = context.self[HOOKS_CONTAINER_SYMBOL];
  if (hooksContainer) {
    if (hooksContainer.has(hookClass)) {
      return hooksContainer.get(hookClass) as T;
    }
  } else {
    hooksContainer = new Map();
    context.self[HOOKS_CONTAINER_SYMBOL] = hooksContainer;
  }
  const moduleRef: ModuleRef = context.self[MODULE_REF_SYMBOL];
  const hook = await moduleRef.create(hookClass);
  hooksContainer.set(hookClass, hook);
  return hook;
};

const createHooks = (hookClasses: HookClass[]): Middleware[] => {
  return hookClasses.map(hookClass => {
    return async (context: IHookContext<any>, next) => {
      if ("args" in context && (context as ICrudHookContext<any>).args.params.disableHooks === true) {
        return next();
      }
      const hook = await getHookInstance(context, hookClass);
      await hook.process(context, next);
    };
  });
};

const createHookMap = <T>(hookClassMap: HookClassMap<T>): HookMap<T> => {
  const hooksByMethodName: HookMap<T> = {};
  (Object
    .keys(hookClassMap) as (keyof typeof hookClassMap)[])
    .forEach(methodName => {
      const hookClasses = hookClassMap[methodName];
      hooksByMethodName[methodName] = createHooks(hookClasses);
    });
  return hooksByMethodName;
};

const injectModuleRef = (prototype: Record<PropertyKey, any>): void => {
  Inject(ModuleRef)(prototype, MODULE_REF_SYMBOL);
};

export function Hooks<T>(hookClasses: HookClass<T>[]): MethodDecorator;
export function Hooks<T>(...hookMaps: HookClassMap<T>[]): GenericClassDecorator<Type<T>>;
export function Hooks<T>(...hookClassesOrHookClassMaps: [HookClass<T>[]] | HookClassMap<T>[]): MethodDecorator | GenericClassDecorator<Type<T>> {
  if (Array.isArray(hookClassesOrHookClassMaps[0])) {
    const hooks = createHooks(hookClassesOrHookClassMaps[0]);
    return (classOrPrototype, propertyKey, descriptor) => {
      if (typeof classOrPrototype === "function") {
        throw new Error("Can't apply Hooks decorator to a static method");
      }
      injectModuleRef(classOrPrototype);
      feathersHooks(hooks)(classOrPrototype, propertyKey, descriptor);
    };
  }

  return (clazz: Type<T>) => {
    injectModuleRef(clazz.prototype);
    (hookClassesOrHookClassMaps as HookClassMap<T>[]).forEach(hookClassMap => {
      const hookMap = createHookMap(hookClassMap);
      feathersHooks(clazz, hookMap);
    });
    return clazz;
  };
}
