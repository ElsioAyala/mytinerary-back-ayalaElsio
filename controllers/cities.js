import { response } from "express";
import mongoose from "mongoose";
import { CityModel } from "../models/database/city.js";

export class CitiesController {
  // Recuperar todas las ciudades o las que reciba por query
  static async getAll(req, res) {
    const { name } = req.query;
    const cities = await CityModel.getAll({ name });
    res.json(cities);
  }

  // Crear una Ciudad
  static create(req, res) {
    CityModel.create({ input: req.body })
      .then((result) => {
        res.status(201).json({
          message: "city has been added",
          city: result,
        });
      })
      .catch((error) => {
        let key = Object.keys(error.errors)[0];
        let nameError = error.errors[key].name;

        switch (nameError) {
          case "CastError":
            res.status(400).json({
              message: "invalid data",
              error: `the field ${key} expects a ${error.errors[key].kind}`,
            });
            break;
          case "ValidatorError":
            res.status(400).json({ message: error.errors[key].message });
            break;
          default:
            res.status(500).json({ error: error.message });
            break;
        }
      });
  }

  // Recuperar una ciudad por id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const city = await CityModel.getById(id);
      if (city) return res.json(city);
      res.status(404).json({ message: "City not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar una ciudad
  static update(req, res) {
    const { id } = req.params;
    CityModel.update({ id, input: req.body })
      .then((result) => {
        if (result != null) {
          res.json({
            message: "city updated successfully",
            city: result,
          });
        } else {
          res.status(400).json({ message: "Invalid id" });
        }
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.CastError) {
          res.status(400).json({
            message: "invalid data",
            error: err.message,
          });
        } else {
          res.status(400).json({ error: err.message });
        }
      });
  }

  // Borrar una ciudad
  static delete(req, res) {
    const { id } = req.params;

    const result = CityModel.delete(id)
      .then(() => {
        if (result !== null) {
          res.json({ message: "City deleted" });
        } else {
          res.status(404).json({ message: "Movie not found" });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "invalid data", error: err.message });
      });
  }

  // crear muchas ciudades
  static createMany(req, res) {
    const imput = req.body;
    CityModel.createMany(imput)
      .then((result) => {
        res.json({
          message: "cities has been successfully added",
          cities: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: err.message });
      });
  }
}
