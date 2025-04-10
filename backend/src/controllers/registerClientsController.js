import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientsModel from "../models/Clients.js";
import {config} from "../config.js";
import { text } from "express";


//Creo un array de funciones

const registerClientsController = {};

registerClientsController.register = async (req, res) => {

    //Pedir las cosas que voy a guardar

    const{name, lastName, birthday, email, password, telephone, dui, isVerified} = req.body;

    try {
        //1- Verificar si el cliente ya existe

        const existsClient = await clientsModel.findOne({email})
        
        if(existsClient) {
            return res.json({message: "Client already exists"})
        }

        //2- Encriptar contraseña

        const passwordHash = await bcrypt.hash(password, 10)


        //3- Guardamos al nuevo cliente

        const newClient = new clientsModel({name, lastName, birthday, email, password:passwordHash, telephone, dui: dui || null, isVerified: isVerified || false})

        await newClient.save();


        //Generar un código aleatorio

        const verificationCode = crypto.randomBytes(3).toString("hex")

        //Genero un token para guardar el codigo aleatorio

        const token = jsonwebtoken.sign(

            //1- ¿Qué vamos a guardar?

            {email, verificationCode},

            //2- Secrey key

            config.JWT.secret, 

            //3- Cuando expira

            {expiresIn:"30m"}
        )

        res.cookie("verificationToken", token, {maxAge: 1800000})

        //Enviar correo

        //1- Transporter => quien lo envia

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: config.emailUser.email_user,
                pass: config.emailUser.email_password
            }
        })


        //2- mailOptions 

        const mailOptions = {
            from: config.emailUser.email_user,
            to: email,
            subject: "Verificación de cuenta",
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f7fa;
                                color: #333;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                max-width: 600px;
                                margin: 50px auto;
                                padding: 20px;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                padding-bottom: 20px;
                            }
                            .header h1 {
                                font-size: 32px;
                                color: #4CAF50;
                            }
                            .content {
                                text-align: center;
                                font-size: 16px;
                                line-height: 1.6;
                            }
                            .content p {
                                margin-bottom: 20px;
                            }
                            .code-container {
                                margin-top: 30px;
                                background-color: #f4f4f4;
                                padding: 20px;
                                border-radius: 5px;
                                text-align: center;
                            }
                            .verification-code {
                                font-size: 36px;
                                font-weight: bold;
                                color: #4CAF50;
                                letter-spacing: 5px;
                                background-color: #ffffff;
                                padding: 10px 20px;
                                border-radius: 5px;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }
                            .footer {
                                text-align: center;
                                font-size: 14px;
                                color: #777;
                                margin-top: 30px;
                            }
                            .footer a {
                                color: #4CAF50;
                                text-decoration: none;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>¡Hola! Verifica tu cuenta</h1>
                            </div>
                            <div class="content">
                                <p>Gracias por registrarte en nuestro servicio. Para completar tu registro, por favor ingresa el siguiente código de verificación:</p>
                            </div>
                            <div class="code-container">
                                <div class="verification-code">${verificationCode}</div>
                            </div>
                            <div class="footer">
                                <p>Si no realizaste este registro, por favor ignora este correo.</p>
                                <p>¿Tienes problemas? Contáctanos en <a href="mailto:support@tuservicio.com">support@tuservicio.com</a>.</p>
                                <p>&copy; 2025 Tu Servicio. Todos los derechos reservados.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        //3- Enviar el correo 

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) console.log("error" + error)
            res.json({message: "Email sent" + info})
        });
        

        res.json({ message: "Client registered, please verify your email"});
        
        
    } catch (error) {

        console.log("error" + error)
        res.json({message:"Error" + error});
        
    }
};

registerClientsController.verifyCodeEmail = async(req, res) => {
    const {verificationCodeRequest} = req.body;

    //1- Obtener el token

    const token = req.cookies.verificationToken

    //2- Verificar y decodificar el token

    const decoded = jsonwebtoken.verify(token, config.JWT.secret)

    const {email, verificationCode: storedCode} = decoded

    //3- Comparar los códigos
    if(verificationCodeRequest !== storedCode) {
        return res.json({message:"Invalid code"})
    }

    //Si el codigo es igual, entonces, colocamos el campo
    //"isVerified" en true

    const client = await clientsModel.findOne({email});
    client.isVerified = true;
    await client.save();

    res.clearCookie("verificationToken");
}

export default registerClientsController;