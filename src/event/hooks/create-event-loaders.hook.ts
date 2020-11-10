import { Injectable } from "@nestjs/common";
import { AbstractCreateLoadersHook } from "../../core/data-loader/hooks/abstract-create-loaders.hook";
import { IDataLoadersMap } from "../../core/data-loader/hooks/abstract-create-loaders.types";
import * as DataLoader from "dataloader";
import { ICrudHookContext } from "../../core/crud/crud.types";
import { existenceLoaderFactory } from "../../core/crud/data-loader/factories/existence-loader.factory";
import { EventService } from "../event.service";

declare module "../../core/data-loader/hooks/abstract-create-loaders.types" {
  export interface IDataLoaders {
    eventExistenceLoader?: DataLoader<string, boolean>;
  }
}

@Injectable()
export class CreateEventLoadersHook extends AbstractCreateLoadersHook {
  constructor(private readonly eventService: EventService) {
    super();
  }

  protected createDataLoaders(context: ICrudHookContext<any>): Promise<IDataLoadersMap> | IDataLoadersMap {
    return {
      eventExistenceLoader: existenceLoaderFactory(this.eventService, context.args.params.user)
    };
  }
}
