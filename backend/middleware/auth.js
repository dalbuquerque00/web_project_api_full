//Middleware para verificação do toekn JWT está presente e válido
// Se estiver ok, adiciona o payload ao req.user. Se não, responde com erro 401 (não autorizado)

const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'segredo-super-seguro' } = process.env;

module.exports = (req, res, next) => {
  // Token pode estar em Authorization: Bearer token
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Autorização necessária' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'segredo-super-seguro');
  } catch (err) {
    return res.status(401).send({ message: 'Token inválido' });
  }

  req.user = payload; // { _id: ... }
  next();
};