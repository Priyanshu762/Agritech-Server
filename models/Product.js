const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        mrp:{
            type:Number,
            required:true,
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        },
        ratingAndReviews : [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReviews"
            }
        ],
        quantity:{
            type:Number,
        },
        sold:{
            type:Number,
            default:0
        },
        image1:{
            type:String,
            required:true,
        },
        image2:{
            type:String,
            required:true,
        },
        image3:{
            type:String,
            required:true,
        },
        image4:{
            type:String,
            required:true,
        },
        seller:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

    },
    {timestamps:true}
)

module.exports = mongoose.model("Product", productSchema)