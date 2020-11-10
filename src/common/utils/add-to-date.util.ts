import ms = require("ms");

export const addToDate = (date: Date, timespan: string): Date => {
  const milliseconds = date.getTime() + ms(timespan);
  return new Date(milliseconds);
};
