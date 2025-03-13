import express from "express";

const router = express.Router();

import branchController from "../controllers/branchController.js";

router.route("/")
.get(branchController.getBranches)
.post(branchController.createBranch);

router.route("/:id")
.put(branchController.updateBranch)
.delete(branchController.deleteBranch);

export default router;
