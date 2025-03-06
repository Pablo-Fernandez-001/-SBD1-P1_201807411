const { getConnection } = require('../db/dbConnection');
const fs = require('fs');
const csv = require('csv-parser');
const oracledb = require('oracledb');

class categoriesController {

  // Obtener todos los categorías
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM categories');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener categorías" });
    } finally {
      await connection.close();
    }
  }

  // Obtener un categoría por ID
  static async getOne(req, res) {
    const { id } = req.params; // Obtener el ID de la URL
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM categories WHERE ID = :id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el categoría" });
    } finally {
      await connection.close();
    }
  }

  // insertar un categoría
  static async store(req, res) {
    const connection = await getConnection();
    try {
      const { id, name, created_at, updated_at } = req.body;
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
        `INSERT INTO categories (id, name, created_at, updated_at) 
         VALUES (:id, :name, :created_at, :updated_at)`,
        [id, name, created_at, updated_at],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario insertado correctamente", user: { id, name, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el categoría" });
    }
    finally {
      await connection.close();
    }
  }

  // Actualizar un categoría
  static async update(req, res) {
    const { id } = req.params;
    const {name, created_at, updated_at } = req.body;
    const connection = await getConnection();
    if(!created_at){
      created_at = new Date();
    }

    if(!updated_at){
      updated_at = new Date();
    }

    try {
      await connection.execute(
        `UPDATE categories
        SET national_document = name = :name, created_at = :created_at, updated_at = :updated_at
        WHERE id = :id`,
        [name, created_at, updated_at, id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el categoría" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar un categoría
  static async delete(req, res) {
    const { id } = req.params;
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM categories 
          WHERE id = :id`, [id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el categoría" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar todos los categorías
  static async deleteAll(req, res) {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM categories`, [], { autoCommit: true }
      );
      res.json({ message: "Todos los categorías fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los categorías" });
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
        categoriesController.insertClients(results);
        res.json({ data: results });  // Aquí estaba 'req.json', debe ser 'res.json'
      })
      .on('error', (error) => res.status(500).json({ error: "Error al cargar el archivo" }));
  }


  // functions
  static async insertClients(data) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO categories (id, name, created_at, updated_at) 
         VALUES (:id, :name, :created_at, :updated_at)`;

      for (const rows of data) {
        try {
          const allRows = {
            id: Number(rows._0) || null,
            name: rows._1,
            created_at: rows._2 ? new Date(rows._2) : new Date(),
            updated_at: rows._3 ? new Date(rows._3) : new Date()
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

module.exports = categoriesController;
