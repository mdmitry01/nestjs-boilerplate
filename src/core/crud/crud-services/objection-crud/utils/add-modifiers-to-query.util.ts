import { ModifyOperatorValue } from "../objection-crud.types";
import { addToQuery } from "../../../utils/add-to-query.util";
import { normalizeModifyOperatorValue } from "./normalize-modify-operator-value.util";
import { Params } from "@feathersjs/feathers";

export const addModifiersToQuery = <TParams extends Params, TModifiers extends ModifyOperatorValue>(params: TParams, modifiers: TModifiers) => {
  if (!params.query || !("$modify" in params.query)) {
    return addToQuery(params, { $modify: modifiers });
  }
  const normalizedModifiers = normalizeModifyOperatorValue(modifiers);
  const mergedModifiers = Object.assign({}, normalizeModifyOperatorValue(params.query.$modify));
  for (const [modifierName, args] of Object.entries(normalizedModifiers)) {
    if (modifierName in mergedModifiers) {
      throw new Error(`Modifier ${modifierName} is already set`);
    }
    mergedModifiers[modifierName] = args;
  }

  return addToQuery(params, { $modify: mergedModifiers });
};
