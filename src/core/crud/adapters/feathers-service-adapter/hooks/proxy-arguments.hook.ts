import { IHookContext } from "../../../../hooks/hooks.types";
import { NextFunction } from "@feathersjs/hooks";
import { AdapterService } from "@feathersjs/adapter-commons";

const normalizeData = <T>(data: T | T[] | undefined): T[] | undefined => {
  if (!data) {
    return;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
};

export const proxyArgumentsHook = async (context: IHookContext<AdapterService<any>>, next: NextFunction): Promise<void> => {
  const args = context.arguments;
  switch (context.method) {
    case "find":
      context.args = {
        get params() {
          return args[0];
        },
        set params(value) {
          args[0] = value;
        }
      };
      break;
    case "get":
    case "remove":
      context.args = {
        get id() {
          return args[0];
        },
        set id(value) {
          args[0] = value;
        },
        get params() {
          return args[1];
        },
        set params(value) {
          args[1] = value;
        }
      };
      break;
    case "create":
      context.args = {
        get normalizedData() {
          return normalizeData(args[0]);
        },
        get data() {
          return args[0];
        },
        set data(value) {
          args[0] = value;
        },
        get params() {
          return args[1];
        },
        set params(value) {
          args[1] = value;
        }
      };
      break;
    case "update":
    case "patch":
      context.args = {
        get id() {
          return args[0];
        },
        set id(value) {
          args[0] = value;
        },
        get normalizedData() {
          return normalizeData(args[1]);
        },
        get data() {
          return args[1];
        },
        set data(value) {
          args[1] = value;
        },
        get params() {
          return args[2];
        },
        set params(value) {
          args[2] = value;
        }
      };
      break;
    default:
      throw new Error("Unexpected method name " + context.method);
  }
  await next();
};
