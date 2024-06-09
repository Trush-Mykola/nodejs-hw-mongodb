import { isHttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  if (isHttpError(error)) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      errors: error.errors,
      data: { message: 'Contact not found' },
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
