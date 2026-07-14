/**
 * Global error-handling middleware.
 * Catches all errors thrown/rejected in route handlers and returns
 * a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars -- Express requires 4 params for error handler signature
export function errorHandler(err, _req, res, _next) {
  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', err);
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({
    error: {
      message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
