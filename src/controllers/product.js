const db = require("../core/config/db");
const Product = db.product;
const Transaction = db.transaction;
const User = db.user;
const Op = db.Sequelize.Op;
const cloudinary = require("cloudinary").v2;
const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(
  "2df97689f9a0459364d36fcab356c640",
  "9bb2764db2f1eef07358aee153b669b1"
);

const email_from = "development@leverpay.io";
const email_from_name = "Aspire";

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
      userId: id,
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
    const prods = await Product.findAll({ where: { userId: id } });
    return res.status(200).json(prods);
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { user_id, email, payment_type } = req.body;
    const prods = JSON.parse(req.body.products);
    var hold = [];
    prods.map(async (item) => {
      var a = {
        userId: user_id,
        productId: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
        total: item.total,
        payment_type: payment_type,
        email: email,
      };
      hold.push(a);
    });
    console.log(hold);
    const ab = await Transaction.bulkCreate(hold);
    console.log("after ", ab);
    if (email.length > 0) {
      const user = await User.findByPk(user_id);
      loan_submitted_mail(email, user.storename, prods);
    }

    // const send = {
    //   userId:user_id,
    //   email,
    //   payment_type,
    //   price,
    //   total,
    //   quantity,
    //   product_id,
    // };

    // let transaction = new Transaction(send);
    // await transaction.save();

    return res.status(200).send({ message: "Transaction created" });
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
      where: { userId: id },
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
    const prods = await Product.count({ where: { userId: id } });
    const sales = await Transaction.count({
      where: { createdAt: { [Op.gte]: new Date().toJSON().slice(0, 10) } },
    });

    return res.status(200).json({ products: prods, sales: sales });
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

const loan_submitted_mail = async (email, storename, product) => {
  console.log("calling send email");
  var table = `<h5>Hi,</h5><p>You have receive an invoice from ${storename}</p><table border='1' style='width:100%'><thead><tr><td>Product</td><td>Quantity</td><td>Price</td><td>Total</td></tr></thead><tbody>`;
  for (var i = 0; i < product.length; i++) {
    var ab = `<tr><td>${product[i].product.name}</td><td>${product[i].quantity}</td><td>${product[i].product.price}</td><td>${product[i].total}</td></tr>`;
    table += ab;
  }
  table += "</tbody></table>";
  mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: email_from,
          Name: "Leverage Tech Ivy",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Invoice From " + storename,
        HTMLPart: table,
      },
    ],
  });
  return true;
};
