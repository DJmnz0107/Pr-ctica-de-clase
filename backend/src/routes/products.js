import express from "express";

const router = express.Router();

import productContoller from "../controllers/productsController.js";


router.route("/")
.get(productContoller.getProducts)
.post(productContoller.createProducts);

router.route("/:id")
.get(productContoller.getProduct)
.put(productContoller.updateProducts)
.delete(productContoller.deleteProducts);

export default router;