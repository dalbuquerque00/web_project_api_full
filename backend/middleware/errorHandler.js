module.exports = (err, req, res, next) => {
  // status padrão 500 (erro interno)
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Erro interno do servidor'
      : message
  });
};