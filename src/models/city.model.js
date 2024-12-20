export default (sequelize, DataTypes) => {
  const City = sequelize.define(
    "City",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provinceId: {
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

  City.associate = (models) => {
    City.belongsTo(models.Province, {
      foreignKey: "provinceId",
    });
    City.hasMany(models.User, {
      foreignKey: "cityId",
    });
    City.hasMany(models.Item, {
      foreignKey: "cityId",
    });
  };

  return City;
};
