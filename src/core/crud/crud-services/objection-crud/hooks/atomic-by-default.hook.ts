import { ICrudHookContext } from "../../../crud.types";
import { NextFunction } from "@feathersjs/hooks";

export const atomicByDefaultHook = async (context: ICrudHookContext<any>, next: NextFunction): Promise<void> => {
  const { args } = context;
  if (!("atomic" in args.params) && !("transaction" in args.params)) {
    args.params.atomic = true;
  }
  await next();
};
