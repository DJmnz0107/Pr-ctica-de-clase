import nodemailer from "nodemailer";
import {config} from "../config.js";

//1- Configurar quien lo envia

const transporter = nodemailer.createTransport({
    host:"smpt.gmail.com",
    port:465,
    secure:true,
    auth: {
        user: config.emailUser.email_user,
        pass: config.emailUser.email_password
    }
});


//¿A quien le voy a mandar el correo?

const sendEmail = async (to, subject, text) => {

    try {
        const info = await transporter.sendMail({
            from: '"Soporte EPA" <diegojim007@gmail.com>',
            to,
            subject,
            text,
            html
        })

        return info;
    } catch (error) {
        console.log("error" + error);
    }

};

//ULTIMO PASO -> Generar el HTML a enviar
// Función para generar un código aleatorio de 6 dígitos
// Función que crea el correo HTML con el código de recuperación
const HTMLRecoveryEmail = (code) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Recovery</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f6f9;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333;
                font-size: 24px;
                margin-bottom: 20px;
            }
            p {
                color: #555;
                font-size: 16px;
                line-height: 1.5;
            }
            .code-box {
                background-color: #e9f4ff;
                border: 1px solid #b3d7ff;
                padding: 15px;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
                border-radius: 6px;
            }
            .footer {
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 30px;
            }
            .footer a {
                color: #007bff;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Recovery Code</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. To complete the process, please use the following recovery code:</p>
            <div class="code-box">${code}</div>
            <p>This code will expire in 15 minutes. Please make sure to enter it within that time frame.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <div class="footer">
                <p>Thank you for using our service!</p>
                <p>If you need assistance, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};



export {sendEmail, HTMLRecoveryEmail};
