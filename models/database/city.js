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
    return city.find({}).populate("_itineraries", "title");
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
      resolve(city.findOneAndUpdate({ _id: id }, { $set: input }, { new: true }, { runValidators: true, setDefaultsOnInsert: true }).populate("_itineraries"));
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

  static updateItineraries(id, newItinerary) {
    console.log("ID DE LA CIUDAD A ACTUALIZAR: ", id);
    console.log("ID DEL ITINERARIO A AGRERAR: ", newItinerary);
    return new Promise((resolve) => {
      resolve(city.findByIdAndUpdate(id, { $addToSet: { _itineraries: newItinerary } }, { new: true }));
    });
  }
}
