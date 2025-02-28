import mongoose, { mongo } from "mongoose";

//1- Consigurar la URI de la base de datos

const URI = "mongodb://localhost:27017/ferreteriaEPA";


mongoose.connect(URI);


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