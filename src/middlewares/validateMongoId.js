import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const validateMongoId =
  (idName = 'id') =>
  (req, res, next) => {
    const id = req.params[idName];

    if (!id) {
      throw new Error('Id in validateMongoId isn`t provided');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      next(createHttpError(400, 'Invalid id format'));
      return;
    }

    return next();
  };
