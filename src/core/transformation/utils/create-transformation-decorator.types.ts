import { TransformationType } from "class-transformer";

export type Transformer = (value: any, object: Record<any, any>, transformationType: TransformationType) => any;
