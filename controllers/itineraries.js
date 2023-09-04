import mongoose, { get } from "mongoose";
import { ItineraryModel } from "../models/database/itinerary.js";
import { CityModel } from "../models/database/city.js";

export class ItinerariesController {
  /*** CREAR UN ITINERARIO ***/
  static create(req, res) {
    const { title, image, nameUser, photoUser, price, duration, likes, hashtags, comments, _city } = req.body;

    //Obtener City
    CityModel.getById(_city)
      .then((cityFound) => {
        createItinerary(cityFound);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });

    //Crear el Itinerario
    const createItinerary = (cityFound) => {
      const input = { title, image, nameUser, photoUser, price, duration, likes, hashtags, comments, _city: cityFound };

      ItineraryModel.create(input)
        .then((newItinerary) => {
          updateCity(newItinerary, cityFound);
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    };

    //Actualizar city con el nuevo itinerario
    const updateCity = (newItinerary, cityFound) => {
      const update = { _itineraries: [...cityFound._itineraries, newItinerary._id] };

      CityModel.update({ id: cityFound._id, input: update })
        .then((result) => {
          if (result != null) {
            res.json({
              message: "Successfully created itinerary and successfully updated city",
              city: result,
            });
          }
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    };
  }

  /*** CONSULTAR TODOS LOS ITINERARIOS O DE UNA CIUDAD EN PARTICULAR ***/
  static async getAll(req, res) {
    const { city } = req.query;
    const itineraries = await ItineraryModel.getAll({ city });
    res.json(itineraries);
  }

  /*** CONSULTAR UN ITINERARIO EN PARTICULAR POR ID ***/
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const itinerary = await ItineraryModel.getById(id).populate("_city", "city country");
      if (itinerary) return res.json(itinerary);
      res.status(404).json({ message: "Itinerary not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /*** MODIFICAR UN ITINERARIO ***/
  static async update(req, res) {
    const { id } = req.params;
    const { _city } = req.body;

    // Actualizar Itinerario (sin actualizar la ciudad de referencia)
    if (_city === undefined) {
      ItineraryModel.update({ id, input: req.body })
        .then((result) => {
          if (result != null) {
            res.json({
              message: "Successfully updated itinerary",
              itinerary: result,
            });
          } else {
            res.status(400).json({ message: "Invalid id - Itinerary not found" });
          }
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    } else {
      // Actualizar Itinerario (si se actualiza tambien la ciudad de referencia)

      let currentCity;
      let newCity;
      let itinerary;
      let itineraryUpdated;

      // Obtener la nueva ciudad a la cual hará referencia el itinerario actualizado.
      try {
        newCity = await CityModel.getById(_city).then((city) => {
          if (city) return city;
          res.status(404).json({ message: "_city not found" });
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

      // Obtener el itnirario por ID
      try {
        itinerary = await ItineraryModel.getById(id).then((itinerary) => {
          if (itinerary) return itinerary;
          res.status(404).json({ message: "Itinerary not found" });
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

      // Obtener ciudad a la que hace referencia actualmente el itinerario (antes de actualizar)
      try {
        currentCity = await CityModel.getById(itinerary._city).then((city) => {
          if (city) return city;
          res.status(404).json({ message: "_city not found" });
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

      // Eliminar el itinerario del array _itineraries[] de la ciudad actual
      let newArrayItineraries = currentCity._itineraries.filter((iti) => iti.toString() !== itinerary._id.toString());
      console.log("newArrayItineraries: ", newArrayItineraries);
      const update = { _itineraries: newArrayItineraries };

      CityModel.update({ id: currentCity._id, input: update })
        .then((result) => {
          if (result != null) {
            updateItinerary();
          }
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });

      // Actualizar Itinerario con los nuevos datos
      const updateItinerary = () => {
        ItineraryModel.update({ id, input: req.body })
          .then((result) => {
            if (result != null) {
              const updatedItinerary = result;
              itineraryUpdated = result;
              updateNewCity(updatedItinerary);
            } else {
              res.status(400).json({ message: "Invalid id - Itinerary not found" });
            }
          })
          .catch((err) => {
            res.status(400).json({ error: err.message });
          });
      };

      // Agregar el itinirario al array _itineraries[] de la nueva ciudad a la que hace referencia
      const updateNewCity = (updatedItinerary) => {
        let message = "";
        const found = newCity._itineraries.find((itinerary) => itinerary.toString() === updatedItinerary._id.toString());
        if (found) message = "Successfully updated itinerary";
        else message = "Successfully updated itinerary and successfully updated city";

        CityModel.updateItineraries(newCity._id, updatedItinerary._id)
          .then((result) => {
            if (result != null) {
              res.json({
                message: message,
                Itinerary: itineraryUpdated,
              });
            }
          })
          .catch((err) => {
            res.status(400).json({ error: err.message });
          });
      };
    }
  }

  /* BORRAR UN ITINERARIO */
  static async delete(req, res) {
    const { id } = req.params;

    let city;
    let itinerary;

    try {
      itinerary = await ItineraryModel.getById(id).then((itinerary) => {
        if (itinerary) return itinerary;
        res.status(404).json({ message: "Itinerary not found" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

    try {
      city = await CityModel.getById(itinerary._city).then((city) => {
        if (city) return city;
        res.status(404).json({ message: "City not found" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

    // Eliminar el itinerario
    ItineraryModel.delete(id)
      .then(() => {
        res.json({ message: "Itinerary deleted" });
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });

    // Actualizar el array itinerearies[] de la ciudad referenciada
    let newArrayItineraries = city._itineraries.filter((itinerary) => itinerary.toString() !== itinerary._id.toString());
    CityModel.update({ id, input: newArrayItineraries })
      .then(() => {})
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  }
}
