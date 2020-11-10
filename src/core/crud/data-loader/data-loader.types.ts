import { IWithId } from "../../types/common.types";

export type DefaultKey<TValue> = TValue extends IWithId ? "id" : never;
