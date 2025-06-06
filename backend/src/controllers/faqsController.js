import faqsModel from "../models/faqs.js";

//1- Creo un array de funciones vacio

const faqsController = {};

faqsController.getAllFaqs = async (req, res) => {
    try {
        const faqs = await faqsModel.find();

        res.status(200).json(faqs);


        
    } catch (error) {
        
        console.log("error" + error)
        res.status(500).json({message:"Internal server error"})
    }
}

//INSERT

faqsController.insertFaqs = async (req, res) => {

    //1- Pedir las cosas

    const {question, answer, level, isActive} = req.body;

    try {

        //validar 
        //validar si no hay campos vacios

        if(!question || !answer || !level || isActive == undefined) {
            return res.status(400).json({message: "All fields are required"})
        }

        if(level < 1 || level > 10) {
            return res.status(400).json({message: "Level must be between 1 and 10"})
        }

        if(question.length < 4 || answer.lenght < 4) {
            return res.status(400).json({message: "Too short"})
        }

        //Gaurdamos en la base de datos

        const newFaqs = new faqsModel ({
            question, 
            answer,
            level,
            isActive
        });

        newFaqs.save();

        return res.status(200).json({message:"Faqs saved"});
        
    } catch (error) {
        
        console.log("error " + error)
        return res.status(500).json({message:"Internal server error"})
    }
}

//UPDATE

faqsController.updateFaqs = async (req, res) => {
    //1- Pedir las cosas

    const {question, answer, level, isActive} = req.body;

    try {

        if(level < 1 || level > 10) {
            return res
            .status(400)
            .json({message: "Level must be between 1 and 10"});
        }

        if(question.length < 4 || answer.lenght < 4) {
            return res.status(400).json({message: "Too short"})
        }

        const updatedFaqs = await faqsModel.findByIdAndUpdate(
            req.params.id, 
            {question, answer, level, isActive},
            {new:true}
        )

        if(!updatedFaqs) {
            return res.json(400).status({message:"not found"})
        }

        res.status(200).json({message: "Faqs updated"})
        
    } catch (error) {

        console.log("error" + error)
        return res.status(500).json({message:"Internal server error"})
        
    }
}

//Eliminar
faqsController.deleteFaqs = async (req, res) => {

    try {

        const deletedFaqs = await faqsModel.findByIdAndDelete(req.params.id)

        if(!deletedFaqs) {
            return res.status(400).json({message: "Not found"})
        }

        res.status(200).json({message:"Faqs deleted"})
        
    } catch (error) {

        console.log("error" + error);
        return res.status(500).json({message: "Internal server error"})
        
    }
}

//Select by id
faqsController.getFaqsById = async(req, res)=>{
    try {
        const faqs = await faqsModel.findById(req.params.id)
        if(!faqs){
            return res.status(400).json({message: "Not found"});
        }
 
        res.status(200).json(faqs);
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};
 
 

export default faqsController;