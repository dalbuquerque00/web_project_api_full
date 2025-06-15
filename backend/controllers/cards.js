const Card = require('../models/card');

// Lista todos os cards
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Erro ao buscar cards' }));
};

// Cria um novo card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => res.status(400).send({ message: 'Erro ao criar card', error: err.message }));
};

// Remove card só o dono do perfil
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Card não encontrado' });
      if (String(card.owner) !== req.user._id) {
        return res.status(403).send({ message: 'Você não pode excluir este card' });
      }
      return card.deleteOne().then(() => res.send({ message: 'Card excluído' }));
    })
    .catch(() => res.status(500).send({ message: 'Erro ao excluir card' }));
};

// Like 
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Card não encontrado' });
      res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Erro ao dar like' }));
};

// Remover like de um card
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Card não encontrado' });
      res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Erro ao remover like' }));
};