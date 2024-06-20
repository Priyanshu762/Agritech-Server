const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator =require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
require("dotenv").config();


exports.sendotp = async (req, res) =>{
    try {
    const {email}= req.body;
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:'User already registered',
        })
    }
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("Otp generated successfully");
    let result = await OTP.findOne({otp: otp});
    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result = await OTP.findOne({otp: otp});
    }
    const otpPayload = {email, otp};

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    res.status(200).json({
        success:true,
        message:'OTP Sent Successfully',
        otp,
    })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
};



exports.signup = async(req,res)=>{
   try {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone,
        accountType,
        otp,
    } = req.body;
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp || !phone){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }
    if(password !== confirmPassword){
        return res.status(400).json({
        success:false,
        message:"Password and confirm password value does not match",
        });
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User is already registered",
            });
    }
    const recentOtp =  await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("recentotp",recentOtp);
    if(recentOtp.length === 0){
        return res.status(400).json({
            success:false,
            message:"Otp not fond",
            });
    } else if(otp !==recentOtp[0].otp){
        return res.status(400).json({
            success:false,
            message:"Invalid Otp",   
            });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const profiledetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    });

    const user = await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        confirmPassword,
        phone,
        accountType,
        additionalDetails:profiledetails._id,
        image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
        success:true,
        message:"User registered successfully",
        user,
    });
    
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"User cannot be registered successfully please try again ",
        error,
    });
   }
};


exports.login = async(req,res)=>{
    try {
     const {
         email,
         password,
     }=req.body;
     if(!email || !password){
         return res.status(403).json({
             success:false,
             message:"All fields are required please try again",
         })
     }
     const existingUser = await User.findOne({email}).populate("additionalDetails");
     if(!existingUser){
         return res.status(401).json({
             success:false,
             message:"User is not registered please signup first",
             });
     }
     if(await bcrypt.compare(password, existingUser.password)){
        const payload = {
            email: existingUser.email,
            id: existingUser._id,
            accountType: existingUser.accountType,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn:"2h",
        });
        existingUser.token=token;
        existingUser.password= undefined;
        const options ={
            expires: new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user:existingUser,
            message:"loggedin successfully",
        });
     } else{
        return res.status(401).json({
            success:false,
            message:"Password is incorrect",
        });
     }
     
     
    } catch (error) {
        console.log(error);
     return res.status(500).json({
         success:false,
         message:"User cannot be logged in  successfully please try again ",
     });
    }
 };

 exports.changePassword = async (req,res)=>{
    try {
        const {oldPassword,  newPassword, confirmNewPassword} = req.body;
        const id = req.user.id;
    const user = await User.findOne({_id:id});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not Found",
        })
    }

    const storedPassword = user.password;

    if(!oldPassword || !newPassword || !confirmNewPassword){
        return res.status(402).json({
            success:false,
            message:"All fields are required",
        })
    }

    console.log("Old password", storedPassword)
    

    const verify = await bcrypt.compare(oldPassword,storedPassword);
     if(!verify){
        return res.status(400).json({
            success:false,
            message:"Enter correct password",
        })
     }

    

    if(newPassword !== confirmNewPassword){
        return res.status(402).json({
            success:false,
            message:"Both passwords should be same"
        })
    }

    const checkPassword = await bcrypt.compare(newPassword,oldPassword);
    if(checkPassword){
        return res.status(402).json({
            success:false,
            message:"new password should be different from old password"
        })
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
        success:true,
        message:"Password changed successfully",
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Password can't be changed",
        })
        
    }
    



}
