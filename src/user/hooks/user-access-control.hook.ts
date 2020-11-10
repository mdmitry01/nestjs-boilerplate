import { Injectable } from "@nestjs/common";
import { AbstractAccessControlHook } from "../../core/crud/hooks/abstract-access-control.hook";
import { ICrudHookContext } from "../../core/crud/crud.types";
import { addToQuery } from "../../core/crud/utils/add-to-query.util";
import { UserService } from "../user.service";

@Injectable()
export class UserAccessControlHook extends AbstractAccessControlHook<UserService> {
  protected canSave(): Promise<boolean> | boolean {
    return false;
  }

  protected beforeAll({ args }: ICrudHookContext<UserService>): Promise<void> | void {
    args.params = addToQuery(args.params, { $select: ["id", "email"] });
  }
}
