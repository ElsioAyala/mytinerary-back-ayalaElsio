import { UserModel } from "../models/database/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

export const accountExists = async (req, res, next) => {
  try {
    const user = await UserModel.getUserbyEmail(req.body.email);
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Oops! There is already a registered user with this account",
      });
    }
    return next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createHash = (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  return next();
};

export const accountNotExists = async (req, res, next) => {
  const user = await UserModel.getUserbyEmail(req.body.email);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }
  req.user = user;
  return next();
};

export const passwordIsOk = async (req, res, next) => {
  const db_pass = req.user.password;
  const form_pass = req.body.password;
  if (bcrypt.compareSync(form_pass, db_pass)) {
    return next();
  }
  return res.status(400).json({
    response: null,
    message: "wrong password!",
  });
};

export const generateToken = (req, res, next) => {
  const token = sign({ email: req.body.email }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
  req.token = token;
  return next();
};

export const passportVerificator = passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    async (payload, done) => {
      try {
        const user = await UserModel.getUserbyEmail(payload.email);
        if (user) {
          return done(null, user);
        } else {
          return done(null);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);
