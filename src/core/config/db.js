const Sequelize = require("sequelize");
const dbName = "store-keeper";
const dbUser = "admin";
const dbPassword = "#StoreKeeper2024";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: "store-keeper.cfqe88m26610.eu-north-1.rds.amazonaws.com",
  port: "3306",
  dialect: "mysql",
  logging: (...msg) => console.log(msg)
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../model/User.js")(sequelize, Sequelize);
db.product = require("../model/Product.js")(sequelize, Sequelize);
db.transaction = require("../model/Transaction.js")(sequelize, Sequelize);

db.user.hasMany(db.product, {
  foreignKey: "user_id",
});
db.user.hasMany(db.transaction, {
  foreignKey: "user_id",
});
db.transaction.belongsTo(db.product, {
  foreignKey: "product_id",
  as: "product",
});

module.exports = db;
