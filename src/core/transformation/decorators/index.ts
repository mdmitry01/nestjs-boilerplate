import validator from "validator";
import { createTransformationDecorator } from "../utils/create-transformation-decorator.util";
import { TransformOptions } from "class-transformer";

export const ToInt = (options?: TransformOptions & { radix?: number }) => {
  return createTransformationDecorator(value => validator.toInt(value, options?.radix), options);
};

export const ToFloat = (options?: TransformOptions) => {
  return createTransformationDecorator(value => validator.toFloat(value), options);
};

export const ToBoolean = (options?: TransformOptions & { strict?: boolean }) => {
  return createTransformationDecorator(value => validator.toBoolean(value, options?.strict), options);
};

export const Escape = (options?: TransformOptions) => {
  return createTransformationDecorator(value => validator.escape(value), options);
};

export const Trim = (options?: TransformOptions & { chars?: string }) => {
  return createTransformationDecorator(value => validator.trim(value, options?.chars), options);
};
