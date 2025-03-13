/*
Campos:
  name
  lastName
  birthday (esto es de tipo Date o lo puden poner como String)
  email
  address
  hireDate (esto es de tipo Date o lo puden poner como String)
  password
  telephone
  dui
  isssNumber
  isVerified (esto es booleano)
  */


const employeeController = {};

import employeeModel from "../models/Employees.js";

employeeController.getEmployee = async (req, res) => {

    const employees = await employeeModel.find();
    res.json(employees)
}


employeeController.createEmployee = async (req, res) => {
    const {name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified} = req.body;
    
    const newEmployee = new employeeModel({name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified})

    await newEmployee.save();
    res.json({message: "Empleado guardado"});
}

employeeController.deleteEmployee = async (req, res) => {

    const deleteEmployee = await employeeModel.findByIdAndDelete(req.params.id);

    res.json({message:"Empleado eliminado"});

}

employeeController.updateEmployee = async (req, res) => {
    const {name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified} = req.body;

    const updateEmployee = await employeeModel.findByIdAndUpdate(
        req.params.id, 
        {name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified}, {new:true});

    res.json({message: "Empleado actualizado"});
}

export default employeeController;
