const express = require("express");

const router = express.Router();
const { auth } = require("../middlewares/auth");


const { updateDisplayPicture, deleteAccount} = require("../controllers/Profile")

router.put("/updateDisplayPicture",auth,updateDisplayPicture)
router.delete("/deleteProfile",auth,deleteAccount)


module.exports = router;