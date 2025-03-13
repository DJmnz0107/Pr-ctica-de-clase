import express from "express";

const router = express.Router();

import employeeController from "../controllers/employeeController.js";

router.route("/")
.get(employeeController.getEmployee)
.post(employeeController.createEmployee);

router.route("/:id")
.put(employeeController.updateEmployee)
.delete(employeeController.deleteEmployee);

export default router;
