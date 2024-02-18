module.exports = (app) => {
  require("./endpoints/auth.js")(app);
  require("./endpoints/product.js")(app);
};
