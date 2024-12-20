export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      category: {
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

  Category.associate = (models) => {
    Category.hasMany(models.Item, {
      foreignKey: "categoryId",
    });
  };

  return Category;
};
