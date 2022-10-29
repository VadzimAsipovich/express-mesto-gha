const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Запрошенной страницы не существует.' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
