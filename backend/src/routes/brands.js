import express from "express";
import brandsController from "../controllers/brandController.js"
import multer from "multer";

const router = express.Router();

//configurar una carpeta en local que guarde el registro de las imagenes subidas

const upload = multer({dest: "public/"})

router.route("/")
.get(brandsController.getAllBrands)
.post (upload.single("image"), brandsController.insertBrands)
router.route("/:id").put(upload.single("image"), brandsController.putBrands)



export default router;