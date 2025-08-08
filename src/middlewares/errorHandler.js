export function errorHandler(err, req, res, next) {
  const code = err.status || 500;
  res.status(code).json({
    status: code,
    message: code === 500 ? 'Internal Server Error' : err.message,
    data: null,
  });
}