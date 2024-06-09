export const parseFilterParams = (query) => {
  const { isFavourite } = query;
  return {
    isFavourite: isFavourite === 'true',
  };
};
