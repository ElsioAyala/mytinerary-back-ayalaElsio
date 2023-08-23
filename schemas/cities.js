import { Schema } from "mongoose";

let citiesSchema = new Schema({
  city: { type: String, required: [true, "city is required field!"] },
  country: { type: String, required: [true, "country is required field!"] },
  image: { type: String, required: [true, "image is required field!"] },
  description: {
    type: String,
    required: [true, "description is required field!"],
  },
});

export default citiesSchema;
