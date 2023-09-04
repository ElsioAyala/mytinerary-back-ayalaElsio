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

// ##### Copia

// Actualizar Itinerario (sin actualizar la ciudad)
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
  // Actualizar Itinerario (si se actualiza tambien la ciudad)
  // Validar si existe la nueva ciudad pasada por req.body y obtenerla.
  let newCity;
  let itineraryUpdated;
  CityModel.getById(_city)
    .then((cityFound) => {
      if (cityFound) {
        newCity = cityFound;
        getCurrentItinerary();
      } else {
        res.status(404).json({ message: "City not found: Id city invalid" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });

  // Eliminar el itinerario de la ciudad actual
  // Obtener el itineradio actual por ID
  const getCurrentItinerary = () => {
    ItineraryModel.getById(id)
      .then((itinerary) => {
        if (itinerary) {
          getCurrentCity(itinerary._city, itinerary._id);
        } else {
          res.status(404).json({ message: "Itinerary not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  };

  // Obtener la ciudad a la que pertenece actualmente (antes de actualizar) el itinerario
  const getCurrentCity = (id_city, id_itinerary) => {
    CityModel.getById(id_city)
      .then((city) => {
        console.log("city: ", city);
        updateOldCity(city, id_itinerary);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  };

  // Eliminar el tininerario (del array _itiniraries)
  const updateOldCity = (city, id_itinerary) => {
    let newArrayItineraries = city._itineraries.filter((itinerary) => itinerary.toString() !== id_itinerary.toString());
    console.log("newArrayItineraries: ", newArrayItineraries);
    const update = { _itineraries: newArrayItineraries };

    CityModel.update({ id: city._id, input: update })
      .then((result) => {
        if (result != null) {
          updateItinerary();
        }
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  };

  // Actualizar Itinerario
  const updateItinerary = () => {
    let update = req.body;

    ItineraryModel.update({ id, input: update })
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

  // Agregar el itinirario al array de la nueva ciudad
  const updateNewCity = (updatedItinerary) => {
    let message = "";
    const found = newCity._itineraries.find((itinerary) => itinerary.toString() === updatedItinerary._id.toString());
    if (found) message = "Successfully updated itinerary";
    else message = "Successfully created itinerary and successfully updated city";

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
