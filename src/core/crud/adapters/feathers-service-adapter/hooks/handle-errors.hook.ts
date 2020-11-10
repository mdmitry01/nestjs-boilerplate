import { IHookContext } from "../../../../hooks/hooks.types";
import { NextFunction } from "@feathersjs/hooks";
import { FeathersError } from "@feathersjs/errors";
import { HttpException } from "@nestjs/common";
import { AdapterService } from "@feathersjs/adapter-commons";

export const handleErrorsHook = async (context: IHookContext<AdapterService<any>>, next: NextFunction): Promise<void> => {
  try {
    await next();
  } catch (error) {
    if (!(error instanceof FeathersError) || error.code >= 500) {
      throw error;
    }
    throw new HttpException(
      HttpException.createBody(
        error.message,
        error.name,
        error.code
      ),
      error.code
    );
  }
};
