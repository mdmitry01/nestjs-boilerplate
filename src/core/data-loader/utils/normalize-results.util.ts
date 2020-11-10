import { CallbackFunction } from "./normalize-results.types";

export function normalizeResults<TResult extends Record<any, any>, TProperty extends keyof TResult>(
  results: ReadonlyArray<TResult>,
  keys: ReadonlyArray<TResult[TProperty]>,
  property?: TProperty
): (TResult | null)[];
export function normalizeResults<TResult extends Record<any, any>, TProperty extends keyof TResult, TReturn>(
  results: ReadonlyArray<TResult>,
  keys: ReadonlyArray<TResult[TProperty]>,
  property: TProperty,
  callback: CallbackFunction<TResult, TProperty, TReturn>
): ReturnType<typeof callback>[]
export function normalizeResults<TResult extends Record<any, any>, TProperty extends keyof TResult, TReturn>(
  results: ReadonlyArray<TResult>,
  keys: ReadonlyArray<TResult[TProperty]>,
  property?: TProperty,
  callback?: CallbackFunction<TResult, TProperty, TReturn>
) {
  if (!property) {
    property = "id" as TProperty;
  }
  if (!callback) {
    callback = (key, resultMap) => {
      if (resultMap.has(key)) {
        return resultMap.get(key);
      }
      return null;
    };
  }
  const indexedResults = new Map<TResult[TProperty], TResult>();
  results.forEach(result => {
    indexedResults.set(result[property], result);
  });
  return keys.map(key => callback(key, indexedResults));
}
