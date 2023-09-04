import { Router } from "express";
import { validateDataItinerary } from "../middlewares/verifications.js";
import { ItinerariesController } from "../controllers/itineraries.js";

export const itinerariesRouter = Router();

itinerariesRouter.get("/", ItinerariesController.getAll);
itinerariesRouter.post("/", ItinerariesController.create);

itinerariesRouter.get("/:id", ItinerariesController.getById);
itinerariesRouter.delete("/:id", ItinerariesController.delete);
itinerariesRouter.patch("/:id", validateDataItinerary, ItinerariesController.update);

/*citiesRouter.post("/all", CitiesController.createMany);*/
