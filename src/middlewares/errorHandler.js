export function errorHandler(err, req, res, next) {
  const code = err.status || 500;
  res.status(code).json({
    status: code >= 500 ? 'error' : 'fail',
    message: code === 500 ? 'Internal Server Error' : err.message,
    data: null,
  });
}