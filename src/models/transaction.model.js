export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      itemQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // status: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   defaultValue: "new", // Status awal
      // },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      timestamps: true,
    }
  );

  Transaction.associate = (models) => {
    Transaction.hasMany(models.ItemReview, {
      foreignKey: "transactionId",
    });
    Transaction.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Transaction.belongsTo(models.Item, {
      foreignKey: "itemId",
    });
    Transaction.belongsTo(models.TransactionStatus, {
      foreignKey: "statusId",
    });
  };

  return Transaction;
};
