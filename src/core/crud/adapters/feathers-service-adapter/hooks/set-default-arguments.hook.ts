import { ICrudHookContext } from "../../../crud.types";
import { NextFunction } from "@feathersjs/hooks";

export const setDefaultArgumentsHook = async (context: ICrudHookContext<any>, next: NextFunction): Promise<void> => {
  const { args } = context;
  if (!args.params) {
    args.params = {};
  }
  await next();
};
