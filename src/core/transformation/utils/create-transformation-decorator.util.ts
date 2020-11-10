import { Transform, TransformOptions } from "class-transformer";
import { Transformer } from "./create-transformation-decorator.types";

export const createTransformationDecorator = (transformer: Transformer, options?: TransformOptions) => {
  return Transform(
    (value, object, transformationType) => transformer(String(value), object, transformationType),
    options
  );
};
