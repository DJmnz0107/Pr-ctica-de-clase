import mongoose, { mongo } from "mongoose";
import {config} from "./src/config.js";
//1- Consigurar la URI de la base de datos


mongoose.connect(config.db.URI);


//------------- Comprobar que todo funciona -------------------//

const connection = mongoose.connection;

//Veo si funciona 


connection.once("open", () => {
    console.log("DB is connected");
});

connection.on("disconnected",() => {
    console.log("DB is disconnected");
});

connection.on("error", () => {
    console.log("Error en la conexión");
});