import { toNumber } from 'lodash';

export const getEnumValues = <TEnum extends object>(obj: TEnum): number[] =>
  Object.keys(obj)
    .filter((key) => !isNaN(Number(key)))
    .map((value) => Number(value));

export const getEnumValuesExcluding = <TEnum extends object>(obj: TEnum, valuesToExclude: number[]): number[] =>
  Object.keys(obj)
    .filter((key) => !isNaN(Number(key)) && !valuesToExclude.includes(toNumber(key)))
    .map((value) => Number(value));

export const getEnumValueByKey = <TEnum, TKey extends { toString: () => string }>(
  enumType: TEnum,
  key: TKey
): TEnum[keyof TEnum] => enumType[key.toString() as keyof TEnum];
