const { getConnection } = require('../db/dbConnection');
const fs = require('fs');
const csv = require('csv-parser');
const oracledb = require('oracledb');

class inventoryController {

  // Obtener todos los inventarios
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM inventory',
      );

      if (!result.rows) {
        return res.status(404).json({ error: "No se encontraron usuarios" });
      }

      console.log("Usuarios obtenidos:", result.rows); // Verifica que los datos sean correctos
      res.json(result.rows); // Solo enviamos `rows`, evitando estructuras circulares
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error al obtener usuarios: " + error.message });
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

  // BulkLoad
  static async bulkLoad(req, res) {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv({ headers: true }))  // Corregido aquí
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        inventoryController.insertInventory(results);
        res.json({ data: results });  // Aquí estaba 'req.json', debe ser 'res.json'
      })
      .on('error', (error) => res.status(500).json({ error: "Error al cargar el archivo" }));
  }


  // functions
  static async insertInventory(data) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO inventory (id, product_id, location_id, quantity, created_at, updated_at ) 
         VALUES (:id, :product_id, :location_id, :quantity, :created_at, :updated_at)`;

      for (const rows of data) {
        try {
          const allRows = {
            id: Number(rows._0) || null,
            product_id: rows._1,
            location_id: rows._2,
            quantity: rows._3,
            created_at: rows._4 ? new Date(rows._4) : new Date(),
            updated_at: rows._5 ? new Date(rows._5) : new Date()
          };
          console.log("Insertando datos:", allRows);
          await connection.execute(query, allRows, { autoCommit: true });
        } catch (error) {
          console.error("Error al insertar los datos:", error);
        }
      }

    } catch (error) {
      console.error("Error al obtener la conexión:", error);
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
