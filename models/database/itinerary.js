import "../../config/db.js";
import { model } from "mongoose";
import itinerariesSchema from "../../schemas/itineraries.js";

const itinerary = model("itinerary", itinerariesSchema);

export class ItineraryModel {
  static getAll({ city }) {
    if (city) {
      return itinerary.find({ _city: city }).populate("_city", "city");
    }
    return itinerary.find({}).populate("_city", "city country");
  }

  static create(input) {
    return new Promise((resolve) => {
      resolve(itinerary.create(input));
    });
  }

  static getById(id) {
    return itinerary.findById(id);
  }

  static update({ id, input }) {
    return new Promise((resolve) => {
      resolve(itinerary.findOneAndUpdate({ _id: id }, { $set: input }, { new: true }, { runValidators: true, setDefaultsOnInsert: true }).populate("_city", "city"));
    });
  }

  static delete(id) {
    return new Promise((resolve) => {
      resolve(itinerary.deleteOne({ _id: id }));
    });
  }

  static addLike(itinerary_id, user) {
    return new Promise((resolve) => {
      resolve(itinerary.findByIdAndUpdate(itinerary_id, { $push: { likes: user._id } }, { new: true }));
    });
  }

  static removeLike(itinerary_id, user) {
    return new Promise((resolve) => {
      resolve(itinerary.findByIdAndUpdate(itinerary_id, { $pull: { likes: user._id } }, { new: true }));
    });
  }

  static like(itinerary_id, user) {
    console.log(itinerary_id);
    console.log(user._id);
    return new Promise((resolve) => {
      resolve(itinerary.findOne({ _id: itinerary_id, likes: { $in: [user._id] } }));
    });
  }
}
