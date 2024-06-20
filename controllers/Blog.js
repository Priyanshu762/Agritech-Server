const Blog = require("../models/Blog")
const User = require("../models/User");
const imageUploadToCloudinary = require("../utils/imageUploadToCloudinary");


exports.createBlog = async (req,res)=>{
    try {
        const {title, description, content } = req.body;
        const image = req.files.image;
        // if(!title || !description || !content){
        //     return res.status(400).json({
        //         success:false,
        //         message:"All fields are required"
        //     })
        // }
        const uploadDetails = await imageUploadToCloudinary(image, process.env.FOLDER_NAME)
        const newBlog = await Blog.create({
            title,
            description,
            content,
            image:uploadDetails.secure_url,
        })

        return res.status(200).json({
            success:true,
            message:"New Blog created Successfully",
            data:newBlog,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in creating Blog"
        })
    }
}


exports.updateBlog = async (req,res)=>{
    try {
        const {id, title, description, content, category} = req.body
        const image = req.files.blogImage;
        const uploadDetails = await imageUploadToCloudinary(image, process.env.FOLDER_NAME)
        const updateBlog = await Blog.findByIdAndUpdate(id,{
            title,
            description,
            content,
            category,
            image:uploadDetails.secure_url
        },{new:true})
        
        return res.status(200).json({
            success:true,
            message:"Blog updated Successfully",
            data:updateBlog,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in updating Blog"
        })
    }
}

exports.getaBlog = async (req,res)=> {
    try {

        const {blogId} = req.body
        console.log("Blog Id",blogId)

        const blog = await Blog.findById(blogId)
        const updateViews = await Blog.findByIdAndUpdate(blogId,
            {
                $inc: {numViews : 1}
            },
            {new:true})

        if(!blog){
            return res.status(404).json({
                success:false,
                message:"No blog found with this id"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Blog fetched Successfully",
            data: updateViews
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in fetching Blog"
        })
    }
};

exports.getAllBlogs = async (req,res)=> {
    try {
        const getBlogs = await Blog.find().sort({craetedAt : 1}).exec()

        return res.status(200).json({
            success:true,
            message:"Successfully fetched All blogs",
            data:getBlogs
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in fetching All Blogs"
        })
    }
}

exports.deleteBlog = async (req,res)=> {
    try {
        const {blogId} = req.body
        const deletedBlog = await Blog.findByIdAndDelete(blogId)
        return res.status(200).json({
            success:true,
            message:"Deleted Blog Successfully",
            data:deletedBlog
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in deleting Blog"
        })
    }
}
