const express = require('express');
const router = express.Router();
const responseManager = require('../utils/ResponseManager');
const ValidationResult = require('../utils/ValidationResult');
const {check} = require('express-validator');
const UserController = require('../controllers/user.controller');
const UserRepository = require('../repositories/user.repository');
const BCrypt = require('../utils/BCrypt');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
  check('username').exists(),
  check('email').isEmail().custom(async (value) => {
    let user = await UserRepository.findByEmail(value);

    if(user) {
      throw new Error('User already exists!');
    }
    return true;
  }),
  check('password').isLength({ min: 6 }),
  check('password_c', 'Password does not match!').custom((value, {req}) => {
    if (value !== req.body.password) {
      return false;
    }
    return true;
  })
], ValidationResult, async (req, res) => {
  const responseHandler = responseManager.getResponseHandler(res);
  try {
    let {password} = req.body;
    req.body.password = await BCrypt.hash(password);
    await UserController.create(req.body, responseHandler);
  } catch (e) {
    responseHandler.onError(e);
  }
});

router.post('/login', [
  check('password').exists(),
  check('email').isEmail(),
], ValidationResult, async (req, res) => {
  try {
    await UserController.login(req.body, res);
  } catch (e) {
    responseHandler.onError(e);
  }
});
console.log(AuthMiddleware);
router.get('/get-users', AuthMiddleware, async (req, res) => {
  const responseHandler = responseManager.getResponseHandler(res);
  
  try {
    await UserController.getUsers(req.query, responseHandler);
  } catch (e) {
    responseHandler.onError(e)
  }
});

module.exports = router;
