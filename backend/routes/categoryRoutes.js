import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRoutes = express.Router();

// Admin routes
categoryRoutes.post("/add", protect, adminOnly, upload.single("image"), addCategory);
categoryRoutes.put(
  "/update/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateCategory
);
categoryRoutes.delete("/delete/:id", protect, adminOnly, deleteCategory);

// Public route
categoryRoutes.get("/all", getAllCategories);

export default categoryRoutes;
