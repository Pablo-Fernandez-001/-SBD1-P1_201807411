const { getConnection } = require('../db/dbConnection');
const fs = require('fs');
const csv = require('csv-parser');
const oracledb = require('oracledb');

class usersController {

  // Obtener todos los usuarios
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        'SELECT * FROM clients',
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
      res.status(500).json({ error: "Error al obtener el usuario", error });
    } finally {
      await connection.close();
    }
  }

  // insertar un usuario
  static async store(req, res) {
    const connection = await getConnection();
    try {
      let { id, national_document, name, lastname, phone, email, active, confirmed_email, password, created_at, updated_at } = req.body;
      created_at = created_at ? new Date(created_at) : new Date();
      updated_at = updated_at ? new Date(updated_at) : new Date();

      console.log(req.body);
      if (!req.body) {
        return res.status(400).json({ error: "Faltan datos" });
      }

      await connection.execute(
        `INSERT INTO clients (id, national_document, name, lastname, phone, email, active, confirmed_email, password, created_at, updated_at) 
         VALUES (:id, :national_document, :name, :lastname, :phone, :email, :active, :confirmed_email, :password, :created_at, :updated_at)`,
        [id, national_document, name, lastname, phone, email, active, confirmed_email, password, created_at, updated_at],
        { autoCommit: true }
      );

      res.json({ message: "Usuario insertado correctamente", user: { id, national_document, name, lastname, phone, email, active, confirmed_email, password, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el usuario" });
    } finally {
      await connection.close();
    }
  }


  // Actualizar un usuario
  static async update(req, res) {
    const { id } = req.params;
    const { national_document, name, lastname, phone, email, active, confirmed_email, password, created_at, updated_at } = req.body;
    const connection = await getConnection();
    created_at = created_at ? new Date(created_at) : new Date();
    updated_at = updated_at ? new Date(updated_at) : new Date();

    try {
      await connection.execute(
        `UPDATE clients
        SET national_document = :national_document, name = :name, lastname = :lastname, phone = :phone, email = :email, active = :active, confirmed_email = :confirmed_email, password = :password, created_at = :created_at, updated_at = :updated_at
        WHERE id = :id`,
        [national_document, name, lastname, phone, email, active, confirmed_email, password, created_at, updated_at, id],
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
      await connection.execute(`DELETE FROM clients 
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
      await connection.execute(`DELETE FROM clients`, [], { autoCommit: true }
      );
      res.json({ message: "Todos los usuarios fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los usuarios" });
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
        usersController.insertClients(results);
        res.json({ data: results });  // Aquí estaba 'req.json', debe ser 'res.json'
      })
      .on('error', (error) => res.status(500).json({ error: "Error al cargar el archivo" }));
  }


  // functions
  static async insertClients(data) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO clients (id, national_document, name, lastname, phone, email, active, confirmed_email, password, created_at, updated_at)
      VALUES (:id, :national_document, :name, :lastname, :phone, :email, :active, :confirmed_email, :password, :created_at, :updated_at)`;

      for (const rows of data) {
        try {
          const allRows = {
            id: Number(rows._0) || null,
            national_document: rows._1,
            name: rows._2,
            lastname: rows._3,
            phone: rows._4 ? String(rows._4) : null,
            email: rows._5 || null,
            active: Number(rows._6) || 1,
            confirmed_email: Number(rows._7) || 1,
            password: rows._8,
            created_at: rows._9 ? new Date(rows._9) : new Date(),
            updated_at: rows._10 ? new Date(rows._10) : new Date()
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

module.exports = usersController;
