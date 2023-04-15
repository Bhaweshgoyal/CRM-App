const {
  isAdmin,
  isUserAuthenticated,
} = require("../middleware/auth.validator");
const {
  getAllUsers,
  getUserByEmail,
  getUserByUserId,
  updateUserType,
} = require("../controller/user.controller");

const userRoute = (app) => {
  app.get("/crmapp/api/v1/users", isUserAuthenticated, isAdmin, getAllUsers);
  app.get(
    "/crmapp/api/v1/users/:email",
    isUserAuthenticated,
    isAdmin,
    getUserByEmail
  );
  app.get(
    "/crmapp/api/v1/users/:userId",
    isUserAuthenticated,
    isAdmin,
    getUserByUserId
  );
  app.patch(
    "/crmapp/api/v1/users/updateUserStatus",
    isUserAuthenticated,
    isAdmin,
    updateUserType
  );
};

module.exports = {
  userRoute,
};
