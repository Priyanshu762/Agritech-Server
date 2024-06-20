const mongoose = require("mongoose");
require("dotenv").config();
const connect =()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("Connection successfull")})
    .catch((error)=>{console.log("Connection failed");
    console.error(error.message);
    process.exit(1);
})
}
module.exports = connect;