// Better response handler for reusability
const handleResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({ message, data });
};

export default handleResponse;

