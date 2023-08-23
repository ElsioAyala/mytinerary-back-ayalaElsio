import mongoose from "mongoose";

let uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("database connected"))
  .catch((error) => console.error(error));
