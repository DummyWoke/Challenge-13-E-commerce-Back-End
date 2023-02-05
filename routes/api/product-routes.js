const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Product, Category, Tag, ProductTag} = require("../../models");

    // The `/api/products` endpoint

router.get("/", async(req, res) => {
        // find all products
        try{const CategoryData =await Product.findall({
        // be sure to include its associated Category and Tag data
        include:[{model:Category,attributes:["categoryname"]},
        {model:Tag,attributes:["tagname"]}],
        attributes:[["id", "productname", "price", "stock"],
        [sequelize.literal(
        "(SELECT SUM(productname) FROM productname WHERE productid = categoryid)"
        ),"allProducts",],],});
    
res.status(200).json(ProductData); 
}catch(err){
res.status(500).json(err)
}});
router.get("/", (req, res) => {});

    // find one product
router.get("/:id", async(req, res) => {
    // find a single product by its `id`
    try{const productData = await Category.findByPk(req.params.id,{
    include:[{model:Category,attributes:["categoryname"]},
    {model:Tag,attributes:[tagname]}],
    attributes: ["id", "productname", "price", "stock"]
    [sequelize.literal(
    "(SELECT SUM(productname) FROM productname WHERE productid = productid)"
    ),"allProducts"],});
     // be sure to include its associated Category and Tag data

if(!categoryData){
res.status(404).json({messae: "category id does not exist "});
return;}

res.status(200).json(categoryData);
}catch(err){

res.status(500).json(err);}});

router.post("/", (req, res) => {
    // create a new product
    Product.create({productname: req.body.productname,
    price: req.body.price,
    stock: req.body.stock,
    categoryid: req.body.categoryid,
    tagIds: req.body.tagIds})
    
    .then((product) => {
        // if there"s product tags, we need to create pairings to bulk create in the ProductTag model
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });});

router.put("/:id", (req, res) => {
    // update a product by its `id` value
    Product.update(req.body,{
    where:{
    id: req.params.id,},})

    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
    Product.destroy({
    where:{id:req.params.id}})});
    // delete a product by its `id` value
module.exports = router;