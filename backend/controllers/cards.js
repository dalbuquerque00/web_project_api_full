const Card = require('../models/card');

// Lista todos os cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

// Cria um novo card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch(() => {
      const err = new Error('Erro ao criar card');
      err.statusCode = 400;
      return next(err);
    });
};

// Remove card só o dono do perfil
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error('Card não encontrado');
        err.statusCode = 404;
        return next(err);
      }
      if (String(card.owner) !== req.user._id) {
        const err = new Error('Você não pode excluir este card');
        err.statusCode = 403;
        return next(err);
      }
      return card.deleteOne().then(() => res.send({ message: 'Card excluído' }));
    })
    .catch(next);
};

// Like 
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        const err = new Error('Card não encontrado');
        err.statusCode = 404;
        return next(err);
      }
      res.send(card);
    })
    .catch(next);
};

// Remover like de um card
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        const err = new Error('Card não encontrado');
        err.statusCode = 404;
        return next(err);
      }
      res.send(card);
    })
    .catch(next);
};