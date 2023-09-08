export const getEnumValues = <TEnum extends object>(obj: TEnum): number[] =>
  Object.keys(obj)
    .filter((key) => !isNaN(Number(key)))
    .map((value) => Number(value));
