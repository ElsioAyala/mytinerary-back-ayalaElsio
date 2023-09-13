import { UserModel } from "../models/database/user.js";

export class UsersController {
  // Registro de un Usuario
  static async register(req, res) {
    const input = req.body;
    UserModel.create(input)
      .then((result) => {
        res.status(201).json({
          message: "User created successfully",
          useCreated: result,
        });
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  }

  // Login de un usuario
  static async login(req, res) {
    try {
      res.status(200).json({ message: "successfully logged in", token: req.token, user: { id: req.user._id, email: req.user.email, name: req.user.name, photo: req.user.photo } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async authenticated(req, res) {
    try {
      res.status(200).json({ message: "successfully authenticated", token: req.token, user: { id: req.user._id, email: req.user.email, name: req.user.name, photo: req.user.photo } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async logout(req, res) {
    try {
      res.status(200).json({ message: "logged out", token: req.token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
