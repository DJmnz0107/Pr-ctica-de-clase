import express from "express";
import RecoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

router.route("/requestCode").post(RecoveryPasswordController.requestCode);
//router.route("/verifyCode").post();
//router.route("/newPassword").post();

export default router;