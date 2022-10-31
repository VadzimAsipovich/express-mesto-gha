const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { validateUserBody, validateAuth } = require('../middlewares/validation');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuth, login);

module.exports = router;
