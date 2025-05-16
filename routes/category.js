const express = require('express');
const upload = require("../middleware/multer");
const { isAuthenticated } = require("../config/authcheck");

const router = express.Router();
const { categoryPage, getCategory, getCategoryById, addCategory, updateCategory, deleteCategory, deleteCategoryIMAGE } = require("../controller/category");


router.get("/", isAuthenticated, categoryPage);

router.get("/getall", getCategory);
router.get("/:id", getCategoryById);

router.post("/add", upload.array('images', 10), addCategory);

router.put("/update", upload.array('images', 10), updateCategory);

router.delete("/delete", deleteCategory);

router.delete("/deleteimage", deleteCategoryIMAGE);



module.exports = router;