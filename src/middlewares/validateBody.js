import createHttpError from 'http-errors';

export const validateBody = (Schema) => async (req, res, next) => {
  try {
    await Schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const errorMessages = err.details
      .map((detail) => detail.message)
      .join(', ');
    next(createHttpError(400, errorMessages));
  }
};
