const Sequelize = require("sequelize");
const dbName = "storekeeper";
const dbUser = "root";
const dbPassword = "root";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: "localhost",
  port: "8889",
  dialect: "mysql",
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
db.transaction.belongsTo(db.transaction, {
  foreignKey: "product_id",
});

module.exports = db;
