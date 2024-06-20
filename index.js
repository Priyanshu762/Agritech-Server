const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile")
const productRoutes = require("./routes/Product")
const paymentRoutes = require('./routes/Payment')
const blogRoutes = require("./routes/Blog")
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connect = require("./config/database");
dotenv.config();
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;


// database connect
connect();
app.use(express.json());
app.use(cookieParser());

// CORS middleware
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/temp/",
    })
  );

// Route for user authentication
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/blogs", blogRoutes)
app.use("/api/v1/payment",paymentRoutes);

// Default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running"
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});

cloudinaryConnect();
