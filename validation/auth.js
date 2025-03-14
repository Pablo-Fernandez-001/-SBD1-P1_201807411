const jwt = require('jsonwebtoken');
const { getConnection } = require('../db/dbConnection');

// Middleware para verificar si el usuario está autenticado
exports.isAuth = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];


    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_key');
        
        // Verificar si el usuario existe en la base de datos
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM clients WHERE email = :email`,
            [decoded.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Guardar los datos del usuario en el objeto `req` para que esté disponible en la siguiente middleware
        req.user = result.rows[0];
        console.log("Usuario autenticado:", req.user);
        req.decoded = decoded;
        console.log("Usuario autenticado:", req.decoded);

        next(); // Continuar con la ejecución de la ruta
    } catch (error) {
        console.error("Error en la autenticación:", error);
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};
