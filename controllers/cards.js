const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const {
    name,
    link,
    likes,
    createdAt,
  } = req.body;
  const owner = req.user._id;

  Card.create({
    name,
    link,
    likes,
    owner,
    createdAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Карточка с указанным _id не найдена." });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Передан некорректный id карточки" });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: "Карточка с указанным _id не найдена." });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      res.status(400).send({ message: "Передан некорректный id карточки" });
      return;
    }
    res.status(500).send({ message: "Произошла ошибка" });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: "Карточка с указанным _id не найдена." });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === "CastError") {
      res.status(400).send({ message: "Передан некорректный id карточки" });
      return;
    }
    res.status(500).send({ message: "Произошла ошибка" });
  });
