
const {instance} = require("../config/razorpay")
const Product = require('../models/Product')
const { default: mongoose } = require("mongoose")
require("dotenv").config()
const crypto = require("crypto")
const { paymentSuccess } = require("../mail/templates/paymentSuccess")
const mailSender = require("../utils/mailSender")
const User = require("../models/User")


exports.capturePayment = async (req,res)=>{
    const {products} = req.body;
    console.log("IDSSS",products)
    const userId = req.user.id;

    if(products.length === 0){
        return res.json({status:false, message:"Please provide course Id"})
    }

    let totalAmount = 0;
    
    for(const product_id of products){
        let product;
        try {
            product = await Product.findById(product_id)
            if(!product){
                return res.status(200).json({success:false, message:"No product found"})
            }

            const uid = new mongoose.Types.ObjectId(userId)
            
            totalAmount +=product.price;

        } catch (error) {
                    console.log(error)
                    return res.status(500).json({success:false, message:error.message})

            
        }
    }

    const options = {
        amount : totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try {
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        res.json({
            success:true,
            message:paymentResponse

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:"Could not initialize order"})
    }
}



exports.verifyPayment = async (req,res)=> {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_signature = req.body?.razorpay_signature
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const courses = req.body?.products
    const userId = req.user.id

    if(!razorpay_order_id || 
        !razorpay_payment_id ||
        !razorpay_signature || 
        !courses || !userId
    ){
        return res.status(200).json({success:false, message:"Paymnet Failed"})
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto.createHmac("sha256" , process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex")

    if(expectedSignature === razorpay_signature){
        
        return res.status(200).json({success:true, message:"Payment Verified"})
    }

    return res.status(500).json({success:false, message:"Payment Failed"})


}


exports.sendPaymentSuccessEmail = async (req,res)=>{
    const {orderId, paymentId, amount} = req.body
    const userId = req.user.id

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({success:false, message:"Please provide all fields"})
    }

    try {
        const buyer = await User.findById(userId)
        await mailSender(
            buyer.email,
            `Payment Received`,
            paymentSuccess(`${buyer.firstname}`, amount/100, orderId, paymentId)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:"Could Not send Email"})
    }
}