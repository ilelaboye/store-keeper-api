module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define("transactions", {
    userId: {
      type: Sequelize.INTEGER,
    },
    productId: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
    },
    price: {
      type: Sequelize.STRING,
    },
    payment_type: {
      type: Sequelize.STRING,
    },
    total: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
  });
  return Transaction;
};
