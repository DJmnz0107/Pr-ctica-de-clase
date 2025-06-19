
//importar todo lo de la libreria "express"
import express from 'express';
import productsRoutes from "./src/routes/products.js"
import clientRoutes from "./src/routes/clients.js"
import employeeRoutes from "./src/routes/employee.js"
import branchRoutes from "./src/routes/branch.js"
import reviewRoutes from "./src/routes/reviews.js"
import employeeRegisterRoutes from "./src/routes/registerEmployee.js"
import loginRoute from "./src/routes/login.js"
import cookieParser from 'cookie-parser';
import logoutRoute from "./src/routes/logout.js"
import registerClientsRoutes from "./src/routes/registerClients.js";
import RecoveryPasswordRoutes from './src/routes/recoveryPassword.js';
import providersRoutes from "./src/routes/Providers.js"
import brandsRoutes from "./src/routes/brands.js"
import tasksRoutes from "./src/routes/tasks.js"
import { validateAuthToken } from './src/middlewares/validateAuthToken.js';
import faqsRoutes from "./src/routes/Faqs.js"
import cors from "cors";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";




//Creo una constante que es igual a la libreria que acabo de importar y lo ejecuto
const app = express();

app.use(
    cors({
      origin: "https://pr-ctica-de-clase.vercel.app",
      // Permitir envío de cookies y credenciales
      credentials: true
    })
  );

//middleware
app.use(express.json());

//Traemos el archivo JSON

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("./Documentacion EPA.json"), "utf-8")
);

//Mostramos el archivo al ingresar a /api/docs
app.use("/api/docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cookieParser());
app.use("/api/registerEmployee", employeeRegisterRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/clients", clientRoutes );
app.use("/api/employees", employeeRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/registerEmployee", validateAuthToken(["admin"]), employeeRegisterRoutes);
app.use("/api/login", loginRoute);
app.use("/api/logout", logoutRoute);
app.use("/api/registerClients", registerClientsRoutes);
app.use("/api/RecoveryPassword", RecoveryPasswordRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/providers", validateAuthToken(["admin"]), providersRoutes);
app.use("/api/brands", brandsRoutes)
app.use("/api/faqs", faqsRoutes);


//Exporto la constante para poder usar express en otros archivos
export default app;
