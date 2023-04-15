const { signUp, signIn } = require("../controller/auth.controller");

module.exports = (app) => {
  app.post("/crmapp/api/v1/auth/signup", signUp);
  app.post("/crmapp/api/v1/auth/signin", signIn);
};
