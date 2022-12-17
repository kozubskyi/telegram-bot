const { Router } = require('express');
const HttpErrors = require('http-errors');
const UserModel = require('../models/user');

const usersController = Router();

usersController.get('/', async (req, res, next) => {
  try {
    const users = await UserModel.find();

    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
});

usersController.get('/:id', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

usersController.get('/chatId/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const user = await UserModel.findOne({ chatId });

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

usersController.get('/:name/:surname', async (req, res, next) => {
  try {
    const { name, surname } = req.params;

    const user = await UserModel.findOne({ firstName: name, lastName: surname });

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

usersController.post('/', async (req, res, next) => {
  try {
    const { chatId } = req.body;

    const existing = await UserModel.findOne({ chatId });

    if (existing) throw new HttpErrors.Conflict(`Користувач з chatId ${chatId} вже є у базі даних`);

    const newUser = await UserModel.create(req.body);

    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});

usersController.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
});

usersController.patch('/chatId/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const updatedUser = await UserModel.findOneAndUpdate({ chatId }, req.body, { new: true });

    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
});

usersController.patch('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    const updatedUser = await UserModel.findOneAndUpdate({ username }, req.body, { new: true });

    res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
});

usersController.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    res.status(200).send(deletedUser);
  } catch (err) {
    next(err);
  }
});

usersController.delete('/chatId/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const deletedUser = await UserModel.findOneAndDelete({ chatId });

    res.status(200).send(deletedUser);
  } catch (err) {
    next(err);
  }
});

usersController.delete('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    const deletedUser = await UserModel.findOneAndDelete({ username });

    res.status(200).send(deletedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = usersController;
