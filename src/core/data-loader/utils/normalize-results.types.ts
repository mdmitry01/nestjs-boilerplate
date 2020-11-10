export type CallbackFunction<TResult, TProperty extends keyof TResult, TReturn> = (
  key: TResult[TProperty],
  resultMap: Map<TResult[TProperty], TResult>
) => TReturn;
