export const dictFromEntries = <
  TEntryKey extends string | number | symbol,
  TEntryValue,
>(
  entries: [TEntryKey, TEntryValue][]
): { [key in TEntryKey]: TEntryValue } =>
  Object.fromEntries(entries) as { [key in TEntryKey]: TEntryValue };
