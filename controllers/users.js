const User = require('../models/user');

const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Передан некорректный id пользователя' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};
