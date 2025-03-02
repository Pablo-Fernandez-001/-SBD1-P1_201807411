const { getConnection } = require('../db/dbConnection');

class usersController {
  
  // Obtener todos los usuarios
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM clients');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    } finally {
      await connection.close();
    }
  }

  // Obtener un usuario por ID
  static async getOne(req, res) {
    const { id } = req.params; // Obtener el ID de la URL
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM clients WHERE ID = :id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario" });
    } finally {
      await connection.close();
    }
  }

  // insertar un usuario
  static async store(req, res) {
    const { id, national_document, name, lastname, phone, email, active, confirmed_email, password, role } = req.body;
    const connection = await getConnection();
    try {
      await connection.execute(
        `INSERT INTO clients (id, national_document, name, lastname, phone, email, active, confirmed_email, password, role) 
        VALUES (:national_document, :name, :lastname, :phone, :email, :active, :confirmed_email, :password, :role)`,
        [id, national_document, name, lastname, phone, email, active, confirmed_email, password, role]
      );
      res.json({ message: "Usuario insertado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al insertar el usuario" });
    } finally {
      await connection.close();
    }
  }

  // Actualizar un usuario
  static async update(req, res) {
    const { id } = req.params;
    const { national_document, name, lastname, phone, email, active, confirmed_email, password, role } = req.body;
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE clients SET national_document = :national_document, name = :name, lastname = :lastname, phone = :phone, email = :email, active = :active, confirmed_email = :confirmed_email, password = :password, role = :role WHERE id = :id`,
        [national_document, name, lastname, phone, email, active, confirmed_email, password, role, id]
      );
      res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar un usuario
    static async delete(req, res) {
        const { id } = req.params;
        const connection = await getConnection();
        try {
        await connection.execute('DELETE FROM clients WHERE id = :id', [id]);
        res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario" });
        } finally {
        await connection.close();
        }
    }

    // Eliminar todos los usuarios
    static async deleteAll(req, res) {
        const connection = await getConnection();
        try {
        await connection.execute('DELETE FROM clients');
        res.json({ message: "Usuarios eliminados correctamente" });
        } catch (error) {
        res.status(500).json({ error: "Error al eliminar los usuarios" });
        } finally {
        await connection.close();
        }
    }
}

module.exports = usersController;
