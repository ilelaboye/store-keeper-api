module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("transactions", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },
    price: {
      type: Sequelize.STRING,
    },
    total: {
      type: Sequelize.STRING,
    },
  });
  return Product;
};
