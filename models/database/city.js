import "../../config/db.js";
import { model } from "mongoose";
import citiesSchema from "../../schemas/cities.js";

const city = model("city", citiesSchema);

export class CityModel {
  static getAll({ name }) {
    if (name) {
      let regex = new RegExp("^" + name);
      return city.find({ city: { $regex: regex, $options: "i" } });
    }
    return city.find({});
  }

  static create({ input }) {
    return new Promise((resolve) => {
      resolve(city.create(input));
    });
  }

  static getById(id) {
    return city.findById(id);
  }

  static update({ id, input }) {
    return new Promise((resolve) => {
      resolve(
        city.findOneAndUpdate(
          { _id: id },
          { $set: input },
          { new: true },
          { runValidators: true, setDefaultsOnInsert: true }
        )
      );
    });
  }

  static delete(id) {
    return new Promise((resolve) => {
      resolve(city.deleteOne({ _id: id }));
    });
  }

  static createMany(input) {
    return new Promise((resolve) => {
      resolve(city.insertMany(input));
    });
  }
}
