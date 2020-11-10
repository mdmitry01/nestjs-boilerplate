import { IModifyOperatorObject, ModifyOperatorArray, ModifyOperatorValue } from "../objection-crud.types";

const normalizeArrayModifiers = (modifiers: ModifyOperatorArray): IModifyOperatorObject => {
  if (!modifiers.length) {
    return {};
  }
  let modifierNames = modifiers[0];
  if (!Array.isArray(modifierNames)) {
    modifierNames = [modifierNames];
  }
  let args: true | any[] = true;
  if (modifiers.length > 1) {
    args = modifiers.slice(1);
  }
  const normalizedModifiers: IModifyOperatorObject = {};
  modifierNames.forEach(modifierName => {
    normalizedModifiers[modifierName] = args;
  });
  return normalizedModifiers;
};

const normalizeStringModifiers = (modifiers: string): IModifyOperatorObject => {
  if (modifiers[0] === "[" && modifiers[modifiers.length - 1] === "]") {
    return normalizeArrayModifiers(JSON.parse(modifiers));
  } else if (modifiers[0] === "{" && modifiers[modifiers.length - 1] === "}") {
    return JSON.parse(modifiers);
  } else {
    return normalizeArrayModifiers([modifiers.split(",")]);
  }
};

// based on https://github.com/feathersjs-ecosystem/feathers-objection/blob/db2965517f16c7ccd493d25e8465c2158a34437a/src/index.js#L281
export const normalizeModifyOperatorValue = (modifiers: ModifyOperatorValue): IModifyOperatorObject => {
  if (typeof modifiers === "string") {
    return normalizeStringModifiers(modifiers);
  } else if (Array.isArray(modifiers)) {
    return normalizeArrayModifiers(modifiers);
  } else {
    return modifiers;
  }
};
