import express, { json } from "express";
import cors from "cors";
import "dotenv/config";

import { citiesRouter } from "./routes/cities.js";
import { itinerariesRouter } from "./routes/itineraries.js";
import "./config/db.js";

const app = express();
app.use(cors());
app.use(json());

app.use("/api/cities", citiesRouter);
app.use("/api/itineraries", itinerariesRouter);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
