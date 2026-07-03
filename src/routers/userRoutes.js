const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userController');
const mid = require('../auth-middleware');

// Limita tentativas de login/cadastro por IP para dificultar força bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { message: 'Muitas tentativas. Tente novamente mais tarde.' },
});

router.post('/', authLimiter, userController.createUser);
router.post('/login', authLimiter, userController.loginUser);
router.get('/', mid, userController.getAllUsers);

router.get('/:id', mid, userController.getUserById);
router.put('/:id', mid, userController.updateUser);
router.delete('/:id', mid, userController.deleteUser);

module.exports = router;
