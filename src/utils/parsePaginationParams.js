const parseNumber = (value, defaultNumber) => {
  if (typeof value !== 'string') return defaultNumber;

  const parsedNumber = parseInt(value);

  if (parsedNumber < 0) return defaultNumber;

  if (Number.isNaN(parsedNumber)) return defaultNumber;

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  return {
    page: parseNumber(page, 1),
    perPage: parseNumber(perPage, 5),
  };
};
