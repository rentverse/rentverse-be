export default (sequelize, DataTypes) => {
  const Province = sequelize.define(
    "Province",
    {
      name: {
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

  Province.associate = (models) => {
    Province.hasMany(models.City, {
      foreignKey: "provinceId",
    });
  };

  return Province;
};
