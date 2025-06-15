require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const User = require('./models/user');

const { PORT = 3000, MONGODB_URI = 'mongodb://127.0.0.1:27017/around_auth_db' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas públicas 
app.post('/signup', createUser);
app.post('/signin', login);

// Middleware de autenticação
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Exemplo de rota protegida: informações do usuário atual
app.get('/users/me', (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Usuário não encontrado' });
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Erro ao buscar usuário' }));
});


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