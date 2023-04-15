const userServices = require("../service/auth.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const signUp = async (req, res) => {
  try {
    const result = await userServices.createUser(req.body);
    let statusCode;
    let response;

    if (result.err) {
      statusCode = 403;
      response = result.err;
    } else {
      statusCode = 201;
      response = result.user;
    }
    return res.status(statusCode).send({
      result: response,
    });
  } catch (err) {
    res.status(500).send({
      result: err,
    });
  }
};

const signIn = async (req, res) => {
  let statusCode;
  let response;
  try {
    const result = await userServices.verifyUser(req.body);
    if (result.err) {
      statusCode = 401;
      response = result.err;
    } else {
      statusCode = 200;
      const token = jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET_KEY
      );
      response = {
        message: "User Validated",
        token: token,
      };
    }
    return res.status(statusCode).send({
      result: response,
    });
  } catch (err) {
    res.status(500).send({
      result: err,
    });
  }
};
module.exports = {
  signUp,
  signIn,
};
