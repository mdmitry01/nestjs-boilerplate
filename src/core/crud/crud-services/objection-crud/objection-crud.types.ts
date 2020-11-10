export type ModifyOperatorArray = [string | string[], ...any[]];

export interface IModifyOperatorObject {
  [modifierName: string]: true | any[];
}

export type ModifyOperatorValue =
  string
  | ModifyOperatorArray
  | IModifyOperatorObject;
