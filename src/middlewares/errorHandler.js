export function errorHandler(err, req, res, next) {
  const code = err.status || 500;
  if (code >= 500) {
    // Диагностика серверных ошибок в консоли
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(code).json({
    status: code,
    message: code === 500 ? 'Internal Server Error' : err.message,
    data: null,
  });
}