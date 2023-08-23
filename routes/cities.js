import { Router } from "express";
import { validateDataCity } from "../middlewares/verifications.js";
import { CitiesController } from "../controllers/cities.js";

export const citiesRouter = Router();

citiesRouter.get("/", CitiesController.getAll);
citiesRouter.post("/", CitiesController.create);

citiesRouter.get("/:id", CitiesController.getById);
citiesRouter.delete("/:id", CitiesController.delete);
citiesRouter.patch("/:id", validateDataCity, CitiesController.update);

citiesRouter.post("/all", CitiesController.createMany);
