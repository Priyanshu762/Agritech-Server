
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const imageUploadToCloudinary = require("../utils/imageUploadToCloudinary");

exports.createProduct = async(req,res)=>{
    try {
        const {title,description,price,mrp,category} = req.body;
        const thumbnail1 = req.files.image1;
        const thumbnail2 = req.files.image2;
        const thumbnail3 = req.files.image3;
        const thumbnail4 = req.files.image4;
        if(!title || !description || !price){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const tagDetails = await Category.findById(category);
        const userId = req.user.id;
        console.log("Id",userId);
        const sellerDetails = await User.findById(userId)
        if(!sellerDetails){
            return res.status(404).json({
                success:false,
                message:"No Seller Found",
            })
        }
        console.log("data..",title,description,price)
        console.log("image",thumbnail1)
        const image1 = await imageUploadToCloudinary(thumbnail1, process.env.FOLDER_NAME);
        const image2 = await imageUploadToCloudinary(thumbnail2, process.env.FOLDER_NAME);
        const image3 = await imageUploadToCloudinary(thumbnail3, process.env.FOLDER_NAME);
        const image4 = await imageUploadToCloudinary(thumbnail4, process.env.FOLDER_NAME);

        const newProduct = await Product.create({
            title,
            description,
            seller:sellerDetails._id,
            price,
            mrp,
            image1:image1.secure_url,
            image2:image2.secure_url,
            image3:image3.secure_url,
            image4:image4.secure_url,
            category:tagDetails._id,
        })

        await User.findByIdAndUpdate({_id:sellerDetails._id},
        {
            $push:{
                products:newProduct._id
            }
        })

        await Category.findByIdAndUpdate({_id:tagDetails._id},
            {
                $push :{
                    product:newProduct._id,
                }

        })
        return res.status(200).json({
            success:true,
            message:"Product Added Successfully",
            data:newProduct,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in adding Product"
        })
        
    }
}

exports.getProductDetails = async (req,res)=> {
    try {
        const {productId} = req.body;
        const productDetails = await Product.findById(productId).populate({path: "seller"}).populate({path : "category"}).exec()
        if(!productDetails){
            return res.status(404).json({
                success:false,
                message:"No product found with this id",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Product details Found",
            data:productDetails
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in fetching Product"
        })
    }
}

exports.deleteProduct = async (req,res)=> {
    try {
        const {productId} = req.body;
        if(!productId){
            return res.status(400).json({
                success:false,
                message:"No id found"
            })
        }
        const deletedProduct = await Product.findOneAndDelete(productId);
        return res.status(200).json({
            success:true,
            message:"Product deleted successfully",
            data:deletedProduct
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in deleting Product"
        })
    }
}

exports.getAllProducts = async (req,res)=> {
    try {
        const allProducts = await Product.find({}).populate({path : "seller"}).populate({path : "category"}).exec();
        return res.status(200).json({
            success:true,
            message:"All products fetched successfully",
            data:allProducts
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in getting all Products"
        })
    }
}

exports.getSellerProducts = async (req,res)=>{
    try {
        const userId = req.user.id;
        console.log("Seller",userId)

        const sellerProducts = await Product.find({
            seller: userId,
        }).sort({craetedAt: -1}).populate({path : "category"}).exec()

        return res.status(200).json({
            success:true,
            message: "Fecthed All Products Successfully",
            data: sellerProducts
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in getting all Products"
        })
    }
}