module.exports = (app) => {
  let router = require("express").Router();
  let product = require("../../controllers/product");
  const multer = require("multer");
  const fileUpload = multer();

  router.post(
    "/create/:id",
    fileUpload.fields([
      {
        name: "image",
        maxCount: 1,
      },
    ]),
    product.addProduct
  );
  router.get("/get-products/:id", product.getProducts);
  router.get("/get-kpi/:id", product.getKpi);
  router.post("/add-transaction", product.addTransaction);
  router.get("/get-transaction/:id", product.getTransactions);

  app.use("/api/products", router);
};
