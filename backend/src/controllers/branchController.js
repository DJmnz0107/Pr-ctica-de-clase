/*
Campos:
name,
address,
telephone,
schedule
*/

const branchController = {};

import branchesModel from "../models/Branches.js";


branchController.getBranches = async (req, res) => {

    const branches = await branchesModel.find();
    res.json(branches)
}

branchController.createBranch = async (req, res) => {
    const {name, address, telephone, schedule} = req.body;
    
    const newBranch = new branchesModel({name, address, telephone, schedule})

    await newBranch.save();
    res.json({message: "Sucursal guardada"});
}

branchController.deleteBranch = async (req, res) => {

    const deleteBranch = await branchesModel.findByIdAndDelete(req.params.id);

    res.json({message:"Sucursal eliminada"});
}

branchController.updateBranch = async (req, res) => {
    const {name, address, telephone, schedule} = req.body;

    const updateBranch = await branchesModel.findByIdAndUpdate(
        req.params.id, 
        {name, address, telephone, schedule}, {new:true});

    res.json({message: "Sucursal actualizada"});
}

export default branchController;
