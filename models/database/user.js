import "../../config/db.js";
import { model } from "mongoose";
import usersSchema from "../../schemas/users.js";

const user = model("user", usersSchema);

export class UserModel {
  static getUserbyEmail(email) {
    return user.findOne({ email: email });
  }

  static create(input) {
    return new Promise((resolve) => {
      resolve(user.create(input));
    });
  }
}
