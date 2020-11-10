import { User } from "./user.model";
import { ModelObject } from "objection";

export type PartialUser = Required<Pick<User, "id" | "email">> & Partial<ModelObject<User>>;

declare module "@feathersjs/feathers" {
  interface Params {
    user?: PartialUser;
  }
}
