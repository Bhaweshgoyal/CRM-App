const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const createUser = async (data) => {
  const response = {};
  try {
    const userObj = {
      name: data.name,
      email: data.email,
      userType: data.userType,
      password: data.password,
      userStatus: data.userStatus,
    };
    const newUser = await User.create(userObj);
    response.user = newUser;
    return response;
  } catch (err) {
    response.err = err.message;
    return response;
  }
};

const verifyUser = async (data) => {
  try {
    const response = {};
    const userData = await User.findOne({ email: data.email });
    //   email is null like user does not exist
    if (!userData) {
      response.err = "Invalid Email";
    } else {
      const result = bcrypt.compareSync(data.password, userData.password);
      if (result) {
        response.success = true;
      } else {
        response.err = "Invalid Password";
      }
    }
    return response;
  } catch (err) {
    response.err = err.message;
    return response;
  }
};

const verifyToken = (token) => {
  try {
    var decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decodedToken;
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  createUser,
  verifyUser,
  verifyToken,
};
