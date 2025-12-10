const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar o usuário.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar o usuário.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, pass, cpf } = req.body;

    const passwordEcrypted = await bcrypt.hash(pass, 10);

    const newUserData = { name, email, pass: passwordEcrypted, cpf };
    const createdUser = await userModel.create(newUserData);

    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

const loginUser = async function (req, res) {
  try {
    const { email, pass } = req.body;
    const user = await userModel.findOne(
      { email: email },
      { __v: false, _id: false }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const isPasswordValid = await bcrypt.compare(pass, user.pass);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({
      message: 'Login bem-sucedido',
      token: token,
      userId: user._id,
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Encontra pelo ID e atualiza. { new: true } retorna o documento atualizado.
    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar Usuário!' });
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
};
