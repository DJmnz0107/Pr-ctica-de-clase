
/*
Campos:
name
lastName
birthday
email
password
telephone
dui
isVerified
*/

const clientController = {};

import clientsModel from "../models/Clients.js";

clientController.getClients = async (req, res) => {

    const clients = await clientsModel.find();
    res.json(clients)
}

clientController.createClients = async (req, res) => {
    const {name, lastName, birthday, email, password, telephone, dui, isVerified} = req.body;
    
    const newClient = new clientsModel({name, lastName, birthday, email, password, telephone, dui, isVerified})

    await newClient.save();
    res.json({message: "Cliente guardado"});
}

clientController.deleteClients = async (req, res) => {

    const deleteClient = await clientsModel.findByIdAndDelete(req.params.id);

    res.json({message:"Cliente eliminado"});

}

clientController.updateClient = async (req, res) => {
    const {name, lastName, birthday, email, password, telephone, dui, isVerified} = req.body;

    const updateClient = await clientsModel.findByIdAndUpdate(
        req.params.id, 
        {name, lastName, birthday, email, password, telephone, dui, isVerified}, {new:true});

    res.json({message: "Cliente actualizado"});
}

export default clientController;