module.exports = (app) => {
  let router = require("express").Router();
  let auth = require("../../controllers/auth");

  router.post("/register", auth.register);
  router.post("/login", auth.login);

  app.use("/api/auth", router);
};
