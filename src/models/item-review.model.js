export default (sequelize, DataTypes) => {
  const ItemReview = sequelize.define(
    "ItemReview",
    {
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.INTEGER,
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

  ItemReview.associate = (models) => {
    ItemReview.belongsTo(models.Item, {
      foreignKey: "itemId",
    });
    ItemReview.belongsTo(models.Transaction, {
      foreignKey: "transactionId",
    });
  };

  return ItemReview;
};
