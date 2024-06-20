const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
        trim:true,
    },
    product : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]


})

module.exports = mongoose.model("Category", categorySchema);