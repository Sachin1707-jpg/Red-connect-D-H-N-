const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);

  // Mongoose duplicate key error (e.g. duplicate email/phone)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered`,
      error: 'DUPLICATE_KEY',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
      error: 'VALIDATION_ERROR',
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      error: 'INVALID_ID',
    });
  }

  // JWT errors (in case not caught in middleware)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token', error: 'INVALID_TOKEN' });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
