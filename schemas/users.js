import { Schema } from "mongoose";
import Joi from "joi";

// Schema mongoose
let usersSchema = new Schema({
  name: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  photo: { type: String },
  country: { type: String },
});

export default usersSchema;

//Schemas Joi
export const userSignUpSchema = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  photo: Joi.string().required(),
  country: Joi.string(),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
