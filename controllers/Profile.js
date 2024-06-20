const Profile = require("../models/Profile");
const User = require("../models/User");
const imageUploadToCloudinary = require("../utils/imageUploadToCloudinary");
require("dotenv").config()

exports.updateDisplayPicture = async (req, res) => {
	try {

	const id = req.user.id;
  
    console.log("User id",id)
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
	const image = req.files.pfp;
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await imageUploadToCloudinary(
		image,
		process.env.FOLDER_NAME
	);
	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) { 
        console.log(error)
		return res.status(500).json({
            success: false,
            message: error.message,
        });
		
	}
};

exports.deleteAccount = async (req,res) =>{
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        await User.findByIdAndDelete({_id:id});
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in deleting Account"
        })
        
    }
};