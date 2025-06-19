require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/user');
const { celebrate, Joi, errors } = require('celebrate');
const { validateUrl } = require('./utils/validators');
const { requestLogger, errorLogger } = require('./middleware/logger');

const { PORT = 3000, MONGODB_URI = 'mongodb://127.0.0.1:27017/around_auth_db' } = process.env;

const app = express();
const cors = require('cors');
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

// Rotas públicas 
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateUrl),
    }),
  }),
  createUser
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

// Middleware de autenticação
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger);
// Middleware de erros do celebrate
app.use(errors());

// Middleware de tratamento de erros centralizado (deve ficar depois das rotas)
app.use(errorHandler);

// Conexão com MongoDB e start do servidor
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Erro ao conectar no MongoDB:', err);
  });

module.exports = app;