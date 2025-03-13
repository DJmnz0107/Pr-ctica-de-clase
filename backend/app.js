
//importar todo lo de la libreria "express"
import express from 'express';
import productsRoutes from "./src/routes/products.js"
import clientRoutes from "./src/routes/clients.js"
import employeeRoutes from "./src/routes/employee.js"
import branchRoutes from "./src/routes/branch.js"

//Creo una constante que es igual a la libreria que acabo de importar y lo ejecuto
const app = express();

//middleware
app.use(express.json());
app.use("/api/products", productsRoutes);
app.use("/api/clients", clientRoutes );
app.use("/api/employees", employeeRoutes);
app.use("/api/branches", branchRoutes);



//Exporto la constante para poder usar express en otros archivos
export default app;
