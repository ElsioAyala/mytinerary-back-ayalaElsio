import { Router } from "express";
import { UsersController } from "../controllers/auth.js";
import { accountExists, createHash, accountNotExists, passwordIsOk, generateToken, passportVerificator } from "../middlewares/auth.js";
import { validator } from "../middlewares/verifications.js";
import { userSignUpSchema, userSignInSchema } from "../schemas/users.js";

export const usersRouter = Router();

usersRouter.post("/signup", validator(userSignUpSchema), accountExists, createHash, UsersController.register);
usersRouter.post("/signin", validator(userSignInSchema), accountNotExists, passwordIsOk, generateToken, UsersController.login);
usersRouter.post("/authenticated", passportVerificator.authenticate("jwt", { session: false }), generateToken, UsersController.authenticated);
usersRouter.post("/signout", passportVerificator.authenticate("jwt", { session: false }), UsersController.logout);
