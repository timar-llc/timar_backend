export const normalizeTechnologyName = (input: string): string => {
  const raw = input.trim().toLowerCase();

  const whitelist = ['c++', 'c#', 'f#'];
  if (whitelist.includes(raw)) return raw;

  return (
    raw
      // remove spaces, dots, pluses, hashes, dashes
      .replace(/[\s.+#-]+/g, '')
      .replace(/[^\w]/g, '')
  );
};
