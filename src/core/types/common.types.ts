export type Identifier = string | number;

export interface IWithId {
  id: Identifier;
}

export type OnlyWithId<T> = T extends IWithId ? T : never;
