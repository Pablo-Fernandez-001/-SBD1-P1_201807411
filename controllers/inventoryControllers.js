const { getConnection } = require('../db/dbConnection');

class inventoryController {

  // Obtener todos los inventarios
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM inventory');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener inventarios" });
    } finally {
      await connection.close();
    }
  }

  // Obtener un inventario por ID
  static async getOne(req, res) {
    const { id } = req.params; // Obtener el ID de la URL
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM inventory WHERE ID = :id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el inventario" });
    } finally {
      await connection.close();
    }
  }

  // insertar un inventario
  static async store(req, res) {
    const connection = await getConnection();
    try {
      const { id, product_id, location_id, quantity, created_at, updated_at } = req.body;
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
        `INSERT INTO inventory (id, product_id, location_id, quantity, created_at, updated_at ) 
         VALUES (:id, :product_id, :location_id, :quantity, :created_at, :updated_at)`,
        [id, product_id, location_id, quantity, created_at, updated_at ],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario insertado correctamente", user: { id, product_id, location_id, quantity, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el inventario" });
    }
    finally {
      await connection.close();
    }
  }

  // Actualizar un inventario
  static async update(req, res) {
    const { id } = req.params;
    const { product_id, location_id, quantity, created_at, updated_at  } = req.body;
    const connection = await getConnection();
    if(!created_at){
      created_at = new Date();
    }

    if(!updated_at){
      updated_at = new Date();
    }

    try {
      await connection.execute(
        `UPDATE inventory
        SET id, product_id = :product_id, location_id = :location_id, quantity = :quantity, created_at = :created_at, updated_at = :updated_at
        WHERE id = :id`,
        [product_id, location_id, quantity, created_at, updated_at, id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el inventario" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar un inventario
  static async delete(req, res) {
    const { id } = req.params;
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM inventory 
          WHERE id = :id`, [id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el inventario" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar todos los inventarios
  static async deleteAll(req, res) {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM inventory`, [], { autoCommit: true }
      );
      res.json({ message: "Todos los inventarios fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los inventarios" });
    } finally {
      await connection.close();
    }
  }

  // Login
  static async login(req, res) {
    const { email, password } = req.body;
  }
}

module.exports = inventoryController;
