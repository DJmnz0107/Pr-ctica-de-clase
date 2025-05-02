import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
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
        console.log("error" + error);
    }
}

RecoveryPasswordController.newPassword = async(req, res) => {
    const {newPassword} = req.body;

    try {
    
        //1- Extraer el método de las cookies

        const token = req.cookies.tokenRecoveryCode

        //2- Extraer la información del token

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        //3- Comprobar si el código fue verificado
        if(!decoded.verified) {
            return res.json({message:"Code not verified"})
        }


        //Extraer el email y el userType
        const {email, userType} = decoded;


        //Encriptar la contraseña
        const hashedPassword = await bcryptjs.hash(newPassword, 10)

        let updatedUser
        
        //ÚLTIMO PASO - Actualizar la contraseña
        if(userType === "client") {
            updatedUser = await clientModel.findOneAndUpdate(

                {email},
                {password:hashedPassword},
                {new:true}
            )

        }else if(userType === "employee") {
            updatedUser = await employeeModel.findOneAndUpdate(
                {email},
                {password:hashedPassword},
                {new:true}
            )
        }

        //Eliminar el tokem

        res.clearCookie("tokenRecoveryCode");

        res.json({message:"Password updated successfully"})

    } catch (error) {

        console.log("error" + error)
        
    }
}

export default RecoveryPasswordController;