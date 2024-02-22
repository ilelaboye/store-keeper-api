module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    userId: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },
    image: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
  });
  return Product;
};
