const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const verifyToken = (token) => {
  try {
    var decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decodedToken;
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  verifyToken,
};
