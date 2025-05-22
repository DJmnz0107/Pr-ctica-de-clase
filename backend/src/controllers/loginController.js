import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import clientModel from "../models/Clients.js";
import employeeModel from "../models/Employees.js";
import {config} from "../config.js"


//Array de funciones

const loginController = {};

loginController.login = async (req, res) => {

    const {email, password} = req.body;

    try {
        let userFound;
        let userType;

        //Admin, Empleados y Clientes

        if(email === config.admin.email && password === config.admin.password) {
            userType = "admin";
            userFound = {_id: "admin"};

        } else {

            //empleado

            userFound = await employeeModel.findOne({email});
            userType = "employee";

            //cliente

            if(!userFound) {

                userFound = await clientModel.findOne({email}); 
                userType = "client";

            }

            


        }

        if(!userFound) {
            return res.json({message:"user not found"});
        }


        //Desencriptar la contraseña si no es admin 

        if(userType !== "admin") {
            const isMatch = bcrypt.compare(password, userFound.password)
            if(!isMatch) {
                res.json({message: "Invalid password"})
            }

        }

        //TOKEN 

        jsonwebtoken.sign(
            {id:userFound._id, userType},
            //2- Secreto
            config.JWT.secret, 
            //3- Fecha de expiración
            {expiresIn: config.JWT.expires},
            //4- Función flecha 

            (error, token) => {

                if(error) console.log("error" + error)
                    res.cookie("authToken", token)
                res.json({message: "login successful"})
            }
        )
    } catch (error) {

        console.log("error " + error)
        
    }


};

export default loginController;