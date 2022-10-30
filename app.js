const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const express = require('express');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const emailPattern = /^\S+@\S+\.\S+$/;

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().required().regex(emailPattern),
      password: Joi.string().required().min(8),
      avatar: Joi.string().regex(urlPattern),
    }).unknown(true),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().regex(emailPattern),
      password: Joi.string().required().min(8),
    }).unknown(true),
  }),
  login,
);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Запрошенной страницы не существует.' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
