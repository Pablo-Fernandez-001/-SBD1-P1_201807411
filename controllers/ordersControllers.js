const { getConnection } = require('../db/dbConnection');

class ordersController {

  // Obtener todos los usuarios
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM orders');
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
      const result = await connection.execute('SELECT * FROM orders WHERE ID = :id', [id]);
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
    const connection = await getConnection();
    try {
      const { id, client_id, location_id, created_at, updated_at } = req.body;
      if(!created_at){
        created_at = new Date();
      }

      if(!updated_at){
        updated_at = new Date();
      }

      console.log(req.body);
      if (!req.body) {
        return res.status(400).json({ error: "Faltan datos" });

      }
      await connection.execute(
        `INSERT INTO orders (id, client_id, location_id, created_at, updated_at) 
         VALUES (:id, :client_id, :location_id, :created_at, :updated_at)`,
        [id, client_id, location_id, created_at, updated_at],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario insertado correctamente", user: { id, client_id, location_id, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el usuario" });
    }
    finally {
      await connection.close();
    }
  }

  // Actualizar un usuario
  static async update(req, res) {
    const { id } = req.params;
    const { client_id, location_id, created_at, updated_at } = req.body;
    const connection = await getConnection();
    if(!created_at){
      created_at = new Date();
    }

    if(!updated_at){
      updated_at = new Date();
    }

    try {
      await connection.execute(
        `UPDATE orders
        SET national_document = client_id = :client_id, location_id = :location_id, created_at = :created_at, updated_at = :updated_at
        WHERE id = :id`,
        [ client_id, location_id, created_at, updated_at, id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
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
      await connection.execute(`DELETE FROM orders 
          WHERE id = :id`, [id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
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
      await connection.execute(`DELETE FROM orders`, [], { autoCommit: true }
      );
      res.json({ message: "Todos los usuarios fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los usuarios" });
    } finally {
      await connection.close();
    }
  }

  // Login
  static async login(req, res) {
    const { email, password } = req.body;
  }
}

module.exports = ordersController;
