const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { categoryPage, getCategory, getCategoryById, addCategory, updateCategory, deleteCategory } = require("../controller/category");


router.get("/", isAuthenticated, categoryPage);

router.get("/getall", getCategory);
router.get("/:id", getCategoryById);

router.post("/add", addCategory);

router.put("/update", updateCategory);

router.delete("/delete", deleteCategory);



module.exports = router;