import { Injectable } from "@nestjs/common";
import { AbstractCreateLoadersHook } from "../../core/data-loader/hooks/abstract-create-loaders.hook";
import { IDataLoadersMap } from "../../core/data-loader/hooks/abstract-create-loaders.types";
import * as DataLoader from "dataloader";
import { User } from "../user.model";
import { UserService } from "../user.service";
import { ICrudHookContext } from "../../core/crud/crud.types";
import { dataLoaderFactory } from "../../core/crud/data-loader/factories/data-loader.factory";

declare module "../../core/data-loader/hooks/abstract-create-loaders.types" {
  export interface IDataLoaders {
    userLoader?: DataLoader<string, User>;
  }
}

@Injectable()
export class CreateUserLoadersHook extends AbstractCreateLoadersHook {
  constructor(private readonly userService: UserService) {
    super();
  }

  protected createDataLoaders(context: ICrudHookContext<any>): Promise<IDataLoadersMap> | IDataLoadersMap {
    return {
      userLoader: dataLoaderFactory(this.userService, context.args.params.user)
    };
  }
}
