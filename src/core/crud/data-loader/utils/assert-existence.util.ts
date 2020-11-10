import * as DataLoader from "dataloader";
import { NotFoundException } from "@nestjs/common";

// A nullish value is the value which is either null or undefined.
// https://developer.mozilla.org/en-US/docs/Glossary/nullish
export const assertExistence = async <TKey>(existenceLoader: DataLoader<TKey, boolean>, key: TKey, { skipIfKeyIsNullish = false } = {}): Promise<void> => {
  if (skipIfKeyIsNullish === true && (key === null || key === undefined)) {
    return;
  }

  if (await existenceLoader.load(key) === false) {
    throw new NotFoundException("Can't find record with id " + key);
  }
};
