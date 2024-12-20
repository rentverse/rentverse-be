export default (sequelize, DataTypes) => {
  const ItemImage = sequelize.define(
    "ItemImage",
    {
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
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

  ItemImage.associate = (models) => {
    ItemImage.belongsTo(models.Item, {
      foreignKey: "itemId",
    });
  };

  return ItemImage;
};
