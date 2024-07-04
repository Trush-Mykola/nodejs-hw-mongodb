export const convertBoolean = (req, res, next) => {
  const booleanFields = ['isFavourite'];
  booleanFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.body[field] = req.body[field] === 'true' || req.body[field] === true;
    }
  });
  next();
};
