const reviewController = {};
import reviewModel from "../models/Reviews.js";


reviewController.getReview = async (req, res) => {

    const reviews = await reviewModel.find().populate('idClient')
    res.json(reviews);
}


reviewController.createReview =  async (req, res) => {
    const {comment, rating, idClient} = req.body;
    
    const newReview = new reviewModel({comment, rating, idClient})

    await newReview.save();
    res.json({message: "Comentario guardado"});
}

reviewController.deleteReview = async (req, res) => {

    const deleteProduct = await reviewModel.findByIdAndDelete(req.params.id);

    res.json({message:"Comentario eliminado"});

}

reviewController.updateReview = async (req, res) => {
    const {comment, rating, idClient} = req.body;

    const updateReview = await reviewModel.findByIdAndUpdate(
        req.params.id, 
        {comment, rating, idClient}, {new:true});

    res.json({message: "Comentario actualizado"});
}

export default reviewController;