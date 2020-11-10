import { getRandomInt } from "../../../src/common/utils/get-random-int.util";

export const getRandomArraySlice = <T>(array: T[]): T[] => {
  const begin = getRandomInt(0, array.length);
  const end = getRandomInt(begin, array.length);
  return array.slice(begin, end);
};
