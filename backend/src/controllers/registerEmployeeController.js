import employeeModel from "../models/Employees.js" //Importar modelo de la BD
//Importamos librerias
import bcryptjs from "bcryptjs"; //Encriptar 
import jsonwebtoken from "jsonwebtoken"; //Token
import {config} from "../config.js"

//Crear un array de funciones

const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
    //Pedir todos los campos

    const {name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified} = req.body;

    try {
        //Verificamos si el empleado ya existe
        const employeeExist = await employeeModel.findOne({email})
        if(employeeExist) {
            return res.json({message:"Employee already exist"})
        }

        //Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10)

        const newEmployee = new employeeModel({name, lastName, birthday, email, address, hireDate, password: passwordHash, telephone, dui, isssNumber, isVerified})

        await newEmployee.save();

        //TOKEN

        jsonwebtoken.sign(

            //1- Que voy a guardar
            {id: newEmployee._id},

            //2- Secreto
            config.JWT.secret,

            //3- Cuando expira
             {expiresIn:config.JWT.expires},

             //4- Función flecha

             (error, token) => {
                if(error) console.log("error")

                    res.cookie("authToken", token)
                    res.json({message:"Employee registered"})
             }

        )


    } catch (error) {

        console.log("error" + error)
        res.json({message: "Sign up error"})
        
    }
};

export default registerEmployeeController;
