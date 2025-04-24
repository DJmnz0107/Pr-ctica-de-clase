
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
import RecoveryPasswordController from './src/controllers/recoveryPasswordController.js';

//Creo una constante que es igual a la libreria que acabo de importar y lo ejecuto
const app = express();

//middleware
app.use(express.json());

app.use(cookieParser());
app.use("/api/products", productsRoutes);
app.use("/api/clients", clientRoutes );
app.use("/api/employees", employeeRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/registerEmployee", employeeRegisterRoutes);
app.use("/api/login", loginRoute);
app.use("/api/logout", logoutRoute);
app.use("/api/registerClients", registerClientsRoutes);
app.use("/api/RecoveryPassword", RecoveryPasswordController);



//Exporto la constante para poder usar express en otros archivos
export default app;
