import { Service } from "feathers-objection";
import { FeathersServiceAdapter } from "../../adapters/feathers-service-adapter/feathers-service.adapter";
import { hooks } from "@feathersjs/hooks";
import { atomicByDefaultHook } from "./hooks/atomic-by-default.hook";
import { getCrudMap } from "../../utils/get-crud-map.util";

// TODO: service methods should accept `data: DeepPartial<T>` instead of `data: Partial<T>`
export class ObjectionCrudService<T> extends FeathersServiceAdapter(Service)<T> {
}

hooks(ObjectionCrudService, getCrudMap([
  atomicByDefaultHook
]));
