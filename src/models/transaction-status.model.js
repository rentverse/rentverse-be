export default (sequelize, DataTypes) => {
  const TransactionStatus = sequelize.define(
    "TransactionStatus",
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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

  TransactionStatus.associate = (models) => {
    TransactionStatus.hasMany(models.Transaction, {
      foreignKey: "statusId",
    });
  };

  return TransactionStatus;
};
