export const notFoundHandler = (_, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: { message: 'Route not found' },
  });
};
