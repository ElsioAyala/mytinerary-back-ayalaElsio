import mongoose, { Schema } from "mongoose";

let itinerariesSchema = new Schema({
  title: { type: String, required: [true, "title is required field!"] },
  image: { type: String, required: [true, "image is required field!"] },
  nameUser: { type: String, required: [true, "name is required field!"] },
  photoUser: { type: String, required: [true, "photo is required field!"] },
  price: { type: Number, required: [true, "price is required field!"], min: 0, max: 5 },
  duration: { type: String, required: [true, "duration is required field!"] },
  likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  hashtags: { type: String, required: [true, "hashtag is required field!"] },
  comments: { type: String },
  _city: { type: mongoose.Types.ObjectId, ref: "city", unique: false },
});

export default itinerariesSchema;
