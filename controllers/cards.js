const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedError('Текущий пользователь не может удалить эту карточку.');
      }
      Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => {
        res.send({ data: deletedCard });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id карточки');
      }
      next(err);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Передан некорректный id карточки');
    }
    next(err);
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Передан некорректный id карточки');
    }
    next(err);
  })
  .catch(next);
