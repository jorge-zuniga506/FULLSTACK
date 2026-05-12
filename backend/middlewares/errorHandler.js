module.exports = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Determinar el código de estado
  const statusCode = err.statusCode || err.status || 500;

  // Enviar respuesta de error
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};