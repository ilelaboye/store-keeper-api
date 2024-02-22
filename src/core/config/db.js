// const Sequelize = require("sequelize");
// const dbName = "sql5685027";
// const dbUser = "sql5685027";
// const dbPassword = "5cjAYUYbHb";

// const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//   host: "sql5.freemysqlhosting.net",
//   port: "3306",
//   dialect: "mysql",
//   logging: (...msg) => console.log(msg),
//   pool: {
//     max: 500,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// });

const Sequelize = require("sequelize");
const dbName = "storekeeper";
const dbUser = "root";
const dbPassword = "root";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: "localhost",
  port: "8889",
  dialect: "mysql",
  pool: {
    max: 500,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../model/User.js")(sequelize, Sequelize);
db.product = require("../model/Product.js")(sequelize, Sequelize);
db.transaction = require("../model/Transaction.js")(sequelize, Sequelize);

db.user.hasMany(db.product);
db.user.hasMany(db.transaction);
db.transaction.belongsTo(db.product, {
  as: "product",
});

module.exports = db;
