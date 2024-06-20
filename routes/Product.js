const express = require("express");
const { createProduct, getSellerProducts } = require("../controllers/Products.js");
const { auth } = require("../middlewares/auth");
const { getProductDetails } = require("../controllers/Products.js");
const { deleteProduct } = require("../controllers/Products.js");
const { getAllProducts } = require("../controllers/Products.js");
const { createCategory, categoryPageDetails } = require("../controllers/Category.js");
const { getAllCategory } = require("../controllers/Category.js");

const router = express.Router();
router.post("/createCategory",createCategory)
router.get("/getAllCategory",getAllCategory)
router.post("/productDetails",getProductDetails)
router.get("/getSellerProducts",auth,getSellerProducts)
router.get("/all-products",getAllProducts)
router.post("/getCategoryData",categoryPageDetails)
router.delete("/deleteProduct",auth,deleteProduct)
router.post("/createProduct",auth, createProduct)




module.exports = router ; 