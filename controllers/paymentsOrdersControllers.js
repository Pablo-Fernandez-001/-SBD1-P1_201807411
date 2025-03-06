const { getConnection } = require('../db/dbConnection');

class paymentsOrdersController {

  // Obtener todos los Orden de pagos
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM payments_orders');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener Orden de pagos" });
    } finally {
      await connection.close();
    }
  }

  // Obtener un Orden de pago por ID
  static async getOne(req, res) {
    const { id } = req.params; // Obtener el ID de la URL
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM payments_orders WHERE ID = :id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el Orden de pago" });
    } finally {
      await connection.close();
    }
  }

  // insertar un Orden de pago
  static async store(req, res) {
    const connection = await getConnection();
    try {
      const { id, order_id, payment_method, status, created_at, updated_at } = req.body;
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
        `INSERT INTO payments_orders (id, order_id, payment_method, status, created_at, updated_at) 
         VALUES (:id, :order_id, :payment_method, :status, :created_at, :updated_at)`,
        [id, order_id, payment_method, status, created_at, updated_at],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario insertado correctamente", user: { id, order_id, payment_method, status, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el Orden de pago" });
    }
    finally {
      await connection.close();
    }
  }

  // Actualizar un Orden de pago
  static async update(req, res) {
    const { id } = req.params;
    const { order_id, payment_method, status, created_at, updated_at } = req.body;
    const connection = await getConnection();
    if(!created_at){
      created_at = new Date();
    }

    if(!updated_at){
      updated_at = new Date();
    }

    try {
      await connection.execute(
        `UPDATE payments_orders
        SET id= :id, order_id = :order_id, payment_method = :payment_method, status = :status, created_at = :created_at, updated_at = :updated_at
        WHERE id = :id`,
        [ order_id, payment_method, status, created_at, updated_at, id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el Orden de pago" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar un Orden de pago
  static async delete(req, res) {
    const { id } = req.params;
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM payments_orders 
          WHERE id = :id`, [id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la Orden de pago" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar todos los Orden de pagos
  static async deleteAll(req, res) {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM payments_orders`, [], { autoCommit: true }
      );
      res.json({ message: "Todas las Orden de pagos fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los Orden de pagos" });
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
          usersController.insertPaymentsOrders(results);
          res.json({ data: results });  // Aquí estaba 'req.json', debe ser 'res.json'
        })
        .on('error', (error) => res.status(500).json({ error: "Error al cargar el archivo" }));
    }
  
  
    // functions
    static async insertPaymentsOrders(data) {
      let connection;
      try {
        connection = await getConnection();
        const query = `INSERT INTO payments_orders (id, order_id, payment_method, status, created_at, updated_at) 
         VALUES (:id, :order_id, :payment_method, :status, :created_at, :updated_at)`;
  
        for (const rows of data) {
          try {
            const allRows = {
              id: Number(rows._0) || null,
              order_id: rows._1,
              payment_method: rows._2,
              status: rows._3,
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

module.exports = paymentsOrdersController;
