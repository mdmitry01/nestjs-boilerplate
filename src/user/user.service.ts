import { Inject, Injectable } from "@nestjs/common";
import { ObjectionCrudService } from "../core/crud/crud-services/objection-crud/objection-crud.service";
import { User } from "./user.model";
import { Hooks } from "../core/hooks/hooks.decorator";
import { getCrudMap } from "../core/crud/utils/get-crud-map.util";
import { UserAccessControlHook } from "./hooks/user-access-control.hook";
import { Paginated } from "@feathersjs/feathers";

@Hooks<UserService>(getCrudMap([
  UserAccessControlHook
]))
@Injectable()
export class UserService extends ObjectionCrudService<User> {
  constructor(@Inject(User) userModel: typeof User) {
    super({
      model: userModel,
      whitelist: ["$modify"]
    });
  }

  async getByEmail(email: string): Promise<User> {
    const paginatedResult = await this.find({
      query: { email, $limit: 1 },
      disableAccessControlHooks: true,
      disablePopulateHooks: true
    }) as Paginated<User>;
    return paginatedResult.data[0];
  }
}
