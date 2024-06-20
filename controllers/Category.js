const Category = require("../models/Category");

exports.createCategory = async (req,res)=>{
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        const category = await Category.create({
            name:name,
            description:description,
        })
        console.log(category);

        return res.status(200).json({
            success:true,
            message:"Category created Successfully",
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in creating Category"
        })
    }
}

exports.getAllCategory = async (req,res)=>{
    try {
        const allCategory = await Category.find({},{
            name:true,
            description:true,
        })

        console.log(allCategory);

        return res.status(200).json({
            success:true,
            message:"All Category fetched successfully",
            data:allCategory,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in getting Categories"
        })
    }
}


exports.categoryPageDetails = async (req, res) => {
    try {
      const {categoryId} = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "product",
        })
        .exec()
  
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.product.length === 0) {
        console.log("No products found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No products found for the selected category.",
        })
      }
  
      
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }