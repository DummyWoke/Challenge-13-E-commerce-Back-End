const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Category, Product } = require("../../models");

    // The `/api/categories` endpoint

router.get("/", async(req, res) => {
        // find all categories
        try{const CategoryData =await Category.findall({
        // be sure to include its associated Products
        include:[{model:Product,attributes:["id","productname","price","stock","categoryid"]}],
        attributes:[,
        [sequelize.literal(
        "(SELECT SUM(categoryname) FROM categoryname WHERE categoryid = productid)"
        ),"allcategories",],],});
        // be sure to include its associated Products

        res.status(200).json(CategoryData); 
}catch(err){
res.status(500).json(err)
}});

    // find one category by its `id` value
router.get("/:id", async(req, res) => {
    try{
    const categoryData = await Category.findByPk(req.params.id,{
    include:[{model:Product,attributes:["id","productname","price","stock","categoryid"]}],
    attributes:[
    [sequelize.literal(
    "(SELECT SUM(categoryname) FROM categoryname WHERE categoryid = productid)"),
    "allCategories",],],});
     // be sure to include its associated Products

if(!categoryData){
res.status(404).json({messae: "category id does not exist "});
return;}

res.status(200).json(categoryData);
}catch(err){

res.status(500).json(err);}});

router.post("/", (req, res) => {
    // create a new category
    Category.create({categoryname: req.body.categoryname})});

router.put("/:id", (req, res) => {
    Category.update(req.body,{
    where:{
    id: req.params.id}})});
    // update a category by its `id` value

router.delete("/:id", (req, res) => {
    Category.destroy({
    where:{id:req.params.id}})});
    // delete a category by its `id` value

module.exports = router;