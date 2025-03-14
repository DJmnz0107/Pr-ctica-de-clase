import express from "express";

const router = express.Router();

import reviewController from "../controllers/reviewController.js";


router.route("/")
.get(reviewController.getReview)
.post(reviewController.createReview);

router.route("/:id")
.put(reviewController.updateReview)
.delete(reviewController.deleteReview);


export default router;
