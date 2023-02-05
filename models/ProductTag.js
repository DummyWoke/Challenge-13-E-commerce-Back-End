const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,},

      itemid: {
        type: DataTypes.INTEGER,
        refereces:{
        model:"product",
        key: "id",
        allowNull: false}},

      tagid: {
        type: DataTypes.INTEGER,
        refereces:{
        model:"tag",
        key: "id",
        allowNull: false}},},
  {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "product_tag",});

module.exports = ProductTag;