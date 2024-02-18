const db = require("../core/config/db");
const Product = db.product;
const Transaction = db.transaction;
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "duell3hrn",
  api_key: "975521588482449",
  api_secret: "veageubLKciMAEmN8EOaNdi396Q",
});

exports.addProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { name, price, code } = req.body;
    const id = req.params.id;
    let image = "";
    if (req.files.image) {
      var resp = await uploadImages(req.files.image[0]);
      if (resp.status) {
        image = resp.data.secure_url;
      }
    }
    const prod = {
      user_id: id,
      name,
      price,
      code,
      image,
    };

    let product = new Product(prod);
    await product.save();
    return res.status(200).json({ message: "Product created" });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};

exports.getProducts = async (req, res) => {
  try {
    console.log("get products");
    const id = req.params.id;
    const prods = await Product.findAll({ where: { user_id: id } });
    return res.status(200).json(prods);
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};

exports.addTransaction = async (req, res) => {
  try {
    console.log(req.body);
    const { user_id, product_id, quantity, price, total } = req.body;

    const prod = {
      user_id,
      product_id,
      price,
      quantity,
      total,
    };

    let transaction = new Transaction(prod);
    await transaction.save();
    return res.status(200).json({ message: "Transaction created" });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};

exports.getTransactions = async (req, res) => {
  try {
    console.log("get transactions");
    const id = req.params.id;
    const prods = await Transaction.findAll({
      where: { user_id: id },
      include: "product",
    });

    return res.status(200).json(prods);
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};

exports.getKpi = async (req, res) => {
  try {
    console.log("get kpi");
    const id = req.params.id;
    const prods = await Product.count({ where: { user_id: id } });

    return res.status(200).json({ products: prods, sales: 0 });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};

const uploadImages = async (file, convert = true) => {
  console.log("upload caled");
  var resp = {
    status: false,
    msg: "",
    data: "",
  };
  let dataURI = "";
  if (convert) {
    const b64 = Buffer.from(file.buffer).toString("base64");
    dataURI = "data:" + file.mimetype + ";base64," + b64;
  } else {
    dataURI = file;
  }

  await cloudinary.uploader
    .upload(dataURI, {
      folder: process.env.CLOUDINARYFOLDERNAME,
      timeout: 600000,
      resource_type: "auto",
    })
    .then((result) => {
      console.log("success", result);
      resp.status = true;
      resp.data = result;
    })
    .catch((err) => {
      console.log("err", err);
      resp.status = false;
      resp.msg = err;
    });

  return resp;
};
