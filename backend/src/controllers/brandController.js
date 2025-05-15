import brandsModel from "../models/Brands.js";
import {v2 as cloudinary} from "cloudinary";
import {config} from "../config.js"

//1-En el controlador, siempre se tiene que configurar cloudinary primero
// Cloudinary primero
cloudinary.config( {
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
})

//Array de funciones vacio

const brandsController = {};

brandsController.getAllBrands = async (req, res) => {
    const brands = await brandsModel.find()
    res.json(brands)
}

//INSERT
brandsController.insertBrands = async (req, res) => {
    const {name, year, slogan} = req.body;
    let imageUrl ="";

    if(req.file) {
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder:"public",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "avif"]

            }
        )

        imageUrl = result.secure_url
    }

    //Guardar el registro en la base de datos

    const newBrand = new brandsModel ({name, year, slogan, image:imageUrl})

    newBrand.save();

    res.json({message: "Brand saved"})


}

//UPDATE

brandsController.putBrands = async (req, res) => {
    const {name, year, slogan} = req.body;
    let imageURL = "";

    if(req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "public",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "avif"],
        });
        imageURL = result.secure_url;
    }
    //actualizar el registro en la base de datos

    await brandsModel.findByIdAndUpdate(req.params.id, {name, year, slogan, image:imageUrl}, {new:true});

    res.json({message:"Brand saved"});
};

export default brandsController;
