import { Injectable } from "@nestjs/common";
import { AbstractCreateLoadersHook } from "../../core/data-loader/hooks/abstract-create-loaders.hook";
import { IDataLoadersMap } from "../../core/data-loader/hooks/abstract-create-loaders.types";
import * as DataLoader from "dataloader";
import { ICrudHookContext } from "../../core/crud/crud.types";
import { existenceLoaderFactory } from "../../core/crud/data-loader/factories/existence-loader.factory";
import { CalendarService } from "../calendar.service";

declare module "../../core/data-loader/hooks/abstract-create-loaders.types" {
  export interface IDataLoaders {
    calendarExistenceLoader?: DataLoader<string, boolean>;
  }
}

@Injectable()
export class CreateCalendarLoadersHook extends AbstractCreateLoadersHook {
  constructor(private readonly calendarService: CalendarService) {
    super();
  }

  protected createDataLoaders(context: ICrudHookContext<any>): Promise<IDataLoadersMap> | IDataLoadersMap {
    return {
      calendarExistenceLoader: existenceLoaderFactory(this.calendarService, context.args.params.user)
    };
  }
}
