const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        content:{
            type:String,
            required:true
        },
        category:{
            type:String,
        },
        numViews:{
            type:Number,
            default:0,
        },
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        dislikes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        image:{
            type:String,
            default:"https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-600nw-1029506242.jpg"
        },
        author:{
            type:String,
            default:"Admin"
        }

    },
    {timestamps:true}
)

module.exports = mongoose.model("Blog", blogSchema)