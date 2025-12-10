const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const mid = require('../auth-middleware');

router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);

router.get('/:id', mid, userController.getUserById);
router.put('/:id', mid, userController.updateUser);
router.delete('/:id', mid, userController.deleteUser);

module.exports = router;
