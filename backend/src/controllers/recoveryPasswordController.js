import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientModel from "../models/Clients.js";
import employeeModel from "../models/Employees.js";
import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";
import {config} from "../config.js";

//1- Array de funciones

const RecoveryPasswordController = {};

RecoveryPasswordController.requestCode = async (req, res) => {
    const {email} = req.body;

    try {
        let userFound;
        let userType;

        //Verificamos que el usuario exista

        userFound = await clientModel.findOne({email})

        if(userFound) {
            userType = "client";
        } else {
            userFound = await employeeModel.findOne({email})
            if(userFound) {
                userType = "employee";

            }
        }

        if(!userFound) {
            return res.json({message:"User not found"})
        }

        const code = Math.floor(10000 + Math.random() * 90000).toString();

        const token = jsonwebtoken.sign(

            {email, code, userType, verified:false},

            config.JWT.secret,

            {expiresIn:"20m"}

        )

        res.cookie("tokenRecoveryCode", token, {maxAge: 20 * 60 * 1000})

        //ULTIMO PASO - Enviar el correo

        await sendEmail(
            email,
            "Password recovery code",
            `Your verification is: ${code}`,
            HTMLRecoveryEmail(code)
        );

        res.json({message: "Verification code sent"})
    } catch (error) {

        console.log("error" + error);
        
    }
};

//VERIFICAR CÓDIGO

RecoveryPasswordController.verifyCode = async (req, res) => {
    const {code} = req.body;


    try {
        const token = req.cookies.tokenRecoveryCode;
        //Extraer el código del token

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        //Compa rar 1 el codigo que el usuario escribe
        //con el codigo que tengo guardado en el token


        if(decoded.code !== code) {
        return res.json({message:"Invalid code"})
        }




        const newToken = jsonwebtoken.sign(
            //¿Que vamos a guardar?
            {
                email: decoded.email,
                code: decoded.code,
                userType: decoded.userType,
                verified:true
            },

            //2- Secret key

            config.JWT.secret,
            //3- Cuando expira
            {
                expiresIn:"20m"
            }


        );

        res.cookie("tokenRecoveryCode", newToken, {maxAge:20 * 60 * 1000})

        res.json({message:"Code verified successfully"})




    } catch (error) {
        console.log("errro" + error);
    }
}

export default RecoveryPasswordController;