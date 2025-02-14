export default (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "Item",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
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

  Item.associate = (models) => {
    Item.belongsTo(models.City, {
      foreignKey: "cityId",
    });
    Item.belongsTo(models.Category, {
      foreignKey: "categoryId",
    });
    Item.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Item.hasMany(models.ItemImage, {
      foreignKey: "itemId",
    });
    Item.hasMany(models.ItemReview, {
      foreignKey: "itemId",
    });
    Item.hasMany(models.Transaction, {
      foreignKey: "itemId",
    });
  };

  return Item;
};
