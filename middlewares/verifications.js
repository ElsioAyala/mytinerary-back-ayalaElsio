import Joi from "joi";

export const validateDataCity = (req, res, next) => {
  const payload = req.body;

  for (const key in payload) {
    if (payload[key] === "") {
      return res.status(400).json({ message: `${key} is required field!` });
    }
  }
  next();
};

export const validateDataItinerary = (req, res, next) => {
  const { nameUser, photoUser, price, duration, hashtags, title, image } = req.body;

  if (nameUser === "") {
    return res.status(400).json({ message: `name is required field!` });
  }
  if (photoUser === "") {
    return res.status(400).json({ message: `Photo is required field!` });
  }
  if (title === "") {
    return res.status(400).json({ message: `title is required field!` });
  }
  if (image === "") {
    return res.status(400).json({ message: `image is required field!` });
  }

  if (duration === "") {
    return res.status(400).json({ message: `duration is required field!` });
  }

  if (hashtags === "") {
    return res.status(400).json({ message: `hashtag is required field!` });
  }

  if (price < 1 || price > 5) {
    return res.status(400).json({ message: `price must be a number between 1 and 5` });
  }
  next();
};

export const validator = (schema) => [
  (req, res, next) => {
    const validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) {
      return res.status(400).json({ message: validation.error.details.map((err) => err.message) });
    }
    next();
  },
];
