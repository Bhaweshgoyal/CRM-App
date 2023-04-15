const { verifyToken } = require("../service/auth.service");
const { getUserByEmail } = require("../service/user.service");
const isUserAuthenticated = async (req, res, next) => {
  try {
    const token = req.header(`x-access-token`);
    if (!token) {
      return res.status(401).json({
        message: "JWT token is not provided yet",
      });
    }
    const isVerified = verifyToken(token);
    if (!isVerified) {
      return res.status(401).json({
        message: "Invalid token is provided",
      });
    }

    const userInfo = await getUserByEmail({ email: isVerified.email });
    if (!userInfo) {
      return res.status(401).json({
        message: "Invalid Email Address",
      });
    }
    req.user = userInfo;
    next();
  } catch (err) {
    return err;
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "user is Invalid",
      });
    }

    if (req.user.userType !== "admin") {
      return res.status(401).json({
        message: "user dosent have required permisssion. ",
      });
    }

    next();
  } catch (err) {
    return err;
  }
};

module.exports = { isUserAuthenticated, isAdmin };
