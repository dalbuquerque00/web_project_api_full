const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Ajuste para sua chave secreta (de preferência usar dotenv!)
const { NODE_ENV, JWT_SECRET = 'segredo-super-seguro' } = process.env;

// Controlador para registro do user
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  // Verificação de email existente
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send({ message: 'E-mail já registrado.' });
      }

      // Faz hash da senha
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => {
          // Não retorna o hash de senha!
          const userObj = user.toObject();
          delete userObj.password;
          res.status(201).send(userObj);
        })
        .catch((err) => {
          res.status(400).send({ message: 'Erro ao criar usuário', error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Erro interno do servidor', error: err.message });
    });
};

// Controlador para login (autenticação)
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  // Busca o usuário e inclui o hash da senha (select('+password'))
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Email ou senha incorretos' });
      }

      // Compara o hash da senha
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Email ou senha incorretos' });
          }

          // Gerar JWT só com o _id
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'segredo-super-seguro',
            { expiresIn: '7d' }
          );
          res.send({ token });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Erro interno do servidor', error: err.message });
    });
};

// Retorna as informações do usuário atual
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Usuário não encontrado' });
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Erro ao buscar usuário' }));
};

// Atualiza name e about do perfil (apenas do próprio usuário)
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Usuário não encontrado' });
      res.send(user);
    })
    .catch((err) => res.status(400).send({ message: 'Erro ao atualizar perfil', error: err.message }));
};

// Atualiza avatar (apenas do próprio usuário)
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Usuário não encontrado' });
      res.send(user);
    })
    .catch((err) => res.status(400).send({ message: 'Erro ao atualizar avatar', error: err.message }));
};