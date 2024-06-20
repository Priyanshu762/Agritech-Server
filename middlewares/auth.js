const jwt = require("jsonwebtoken");
exports.auth = async (req,res,next)=>{
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token found",
            })
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            // console.log(decode)
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invalid Token"
            })
            
        }
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"error in validating token"
        })
    }

}