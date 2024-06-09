export const parseSortedParams = (query) => {
  const { sortBy = '_id', sortOrder = 'asc' } = query;
  return {
    sortBy: sortBy || '_id',
    sortOrder: sortOrder || 'asc',
  };
};
