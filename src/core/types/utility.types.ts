// see https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
};

export type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];

export type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

// https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript#comment90615553_46941824
export type Overwrite<T1, T2> = Pick<T1, Exclude<keyof T1, keyof T2>> & T2
