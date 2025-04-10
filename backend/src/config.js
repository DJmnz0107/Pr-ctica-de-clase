import dotenv from "dotenv";

//ejecutamos la libreria dotenv

dotenv.config();


export const config = {
    db: {
        URI:process.env.DB_URI
    },
    server: {
        PORT:process.env.PORT
    },
    JWT: {

        secret: process.env.JWT_SECRET,
        expires: process.env.JWT_EXPIRES

    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    },
    emailUser: {
        email_user: process.env.USER_EMAIL,
        email_password: process.env.USER_PASS
    }
    
};