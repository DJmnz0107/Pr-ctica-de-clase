import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import clientModel from "../models/Clients.js";
import employeeModel from "../models/Employees.js";
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound;
    let userType;

    // Admin
    if (email === config.admin.email && password === config.admin.password) {
      userType = "admin";
      userFound = { _id: "admin" };

    } else {
      // Empleado
      userFound = await employeeModel.findOne({ email });
      userType = "employee";

      // Cliente
      if (!userFound) {
        userFound = await clientModel.findOne({ email });
        userType = "client";
      }

      if (!userFound) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      // Validar contraseña
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      }
    }

    // Generar token
    jsonwebtoken.sign(
      { id: userFound._id, userType },
      config.JWT.secret,
      { expiresIn: config.JWT.expires },
      (error, token) => {
        if (error) {
          console.error("Error al generar token:", error);
          return res.status(500).json({ success: false, message: "Error al generar token" });
        }

        res.cookie("authToken", token, { httpOnly: true });
        return res.status(200).json({
          success: true,
          message: "Inicio de sesión exitoso",
          user: {
            userType,
            id: userFound._id,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export default loginController;
