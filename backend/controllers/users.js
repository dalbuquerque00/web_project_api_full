const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Ajuste para sua chave secreta (de preferência usar dotenv!)
const { NODE_ENV, JWT_SECRET = 'segredo-super-seguro' } = process.env;

// Controlador para registro do user
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  // Verificação de email existente
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const err = new Error('E-mail já registrado.');
        err.statusCode = 409;
        return next(err);
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
          err.statusCode = 400;
          next(err);
        });
    })
    .catch(next);
};

// Controlador para login (autenticação)
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // Busca o usuário e inclui o hash da senha (select('+password'))
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Email ou senha incorretos');
        err.statusCode = 401;
        return next(err);
      }

      // Compara o hash da senha
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('Email ou senha incorretos');
            err.statusCode = 401;
            return next(err);
          }

          // Gerar JWT só com o _id
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'segredo-super-seguro',
            { expiresIn: '7d' }
          );
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

// Retorna as informações do usuário atual
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const err = new Error('Usuário não encontrado');
        err.statusCode = 404;
        return next(err);
      }
      res.send(user);
    })
    .catch(next);
};

// Atualiza name e about do perfil (apenas o usuário pode)
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        const err = new Error('Usuário não encontrado');
        err.statusCode = 404;
        return next(err);
      }
      res.send(user);
    })
    .catch((err) => {
      err.statusCode = 400;
      next(err);
    });
};

// Atualiza avatar (apenas o usuarii pode)
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        const err = new Error('Usuário não encontrado');
        err.statusCode = 404;
        return next(err);
      }
      res.send(user);
    })
    .catch((err) => {
      err.statusCode = 400;
      next(err);
    });
};