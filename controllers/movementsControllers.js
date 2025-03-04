const { getConnection } = require('../db/dbConnection');

class movementsController {

  // Obtener todos los movimientos
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM movements');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener movimientos" });
    } finally {
      await connection.close();
    }
  }

  // Obtener un movimiento por ID
  static async getOne(req, res) {
    const { id } = req.params; // Obtener el ID de la URL
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM movements WHERE ID = :id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "movimientos no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el movimiento" });
    } finally {
      await connection.close();
    }
  }

  // insertar un movimiento
  static async store(req, res) {
    const connection = await getConnection();
    try {
      const { id, location_origin_id, location_dest_id, status, estimate_arrive_date, requested_at, created_at, updated_at } = req.body;
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
        `INSERT INTO movements (id, location_origin_id, location_dest_id, status, estimate_arrive_date, requested_at, created_at, updated_at) 
         VALUES (:id, :location_origin_id, :location_dest_id, :status, :estimate_arrive_date, :requested_at, :created_at, :updated_at)`,
        [id, location_origin_id, location_dest_id, status, estimate_arrive_date, requested_at, created_at, updated_at],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "movimientos insertado correctamente", user: { id, location_origin_id, location_dest_id, status, estimate_arrive_date, requested_at, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el movimiento" });
    }
    finally {
      await connection.close();
    }
  }

  // Actualizar un movimiento
  static async update(req, res) {
    const { id } = req.params;
    const { location_origin_id, location_dest_id, status, estimate_arrive_date, requested_at, created_at, updated_at } = req.body;
    const connection = await getConnection();
    if(!created_at){
      created_at = new Date();
    }

    if(!updated_at){
      updated_at = new Date();
    }

    try {
      await connection.execute(
        `UPDATE movements
        SET location_origin_id = :location_origin_id, location_dest_id = :location_dest_id, status = :status, estimate_arrive_date = :estimate_arrive_date, requested_at = :requested_at, created_at = :created_at, updated_at = :updated_at
        WHERE id = :id`,
        [location_origin_id, location_dest_id, status, estimate_arrive_date, requested_at, created_at, updated_at , id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "movimientos actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el movimiento" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar un movimiento
  static async delete(req, res) {
    const { id } = req.params;
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM movements 
          WHERE id = :id`, [id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "movimientos eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el movimiento" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar todos los movimientos
  static async deleteAll(req, res) {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM movements`, [], { autoCommit: true }
      );
      res.json({ message: "Todos los movimientos fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los movimientos" });
    } finally {
      await connection.close();
    }
  }

  // Login
  static async login(req, res) {
    const { email, password } = req.body;
  }
}

module.exports = movementsController;
