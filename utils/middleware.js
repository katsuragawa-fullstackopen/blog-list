const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformed id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};
module.exports = { unknownEndpoint, errorHandler };
