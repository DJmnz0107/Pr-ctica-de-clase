const logoutController = {};

logoutController.logout = async (req, res) => {
    //1- Borrar la cookie que contiene el token de inicio de sesión
    res.clearCookie("authToken")

    req.json({message:"Logged out successful"});
}

export default logoutController;