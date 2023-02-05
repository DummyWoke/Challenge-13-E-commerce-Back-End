// import models
const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

// Products belongsTo Category

Product.belongsTo(Category,{
foreignKey: "categoryid",});

// Categories have many Products

Category.hasmany(Product,{
foreignkey: "categoryid"});

// Products belongToMany Tags (through ProductTag)

Product.belongToMany(Tag,{
through:ProductTag,
foreignkey: "productid"});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product,{
through: ProductTag,
foreignKey: "tagid",});

module.exports = {
Product,
Category,
Tag,
ProductTag,};