const { getConnection } = require('../db/dbConnection');
const fs = require('fs');
const csv = require('csv-parser');
const oracledb = require('oracledb');

class paymentsOrdersController {

  // Obtener todos los Orden de pagos
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM payments_orders',
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
  // Insertar un Orden de pago
  static async store(req, res) {
    const { id, order_id, payment_method, status, created_at, updated_at } = req.body;
    const results = [req.body];  // Colocamos los datos directamente desde el body en el array

    let connection;
    try {
      connection = await getConnection();
      // Preparar el query para insertar
      const query = `INSERT INTO payments_orders (id, order_id, payment_method, status, created_at, updated_at)
                   VALUES (:id, :order_id, :payment_method, :status, :created_at, :updated_at)`;

      // Se inserta cada fila de los resultados
      for (const rows of results) {
        const allRows = {
          id: Number(rows.id) || null,
          order_id: rows.order_id,
          payment_method: rows.payment_method,
          status: rows.status,
          created_at: rows.created_at ? new Date(rows.created_at) : new Date(),
          updated_at: rows.updated_at ? new Date(rows.updated_at) : new Date(),
        };

        // Buscar si el método de pago existe, si no, insertarlo
        const searchPaymentMethod = await connection.execute(
          'SELECT * FROM payment_methods WHERE method = :payment_method',
          [allRows.payment_method]
        );

        let PaymentMethodId = 0;

        if (searchPaymentMethod.rows.length === 0) {
          const result = await connection.execute('SELECT COUNT(*) AS total FROM payment_methods');
          const total = result.rows[0][0];
          const newId = total + 1;

          await connection.execute(
            `INSERT INTO payment_methods (id, method, created_at, updated_at)
           VALUES (:id, :method, :created_at, :updated_at)`,
            [newId, allRows.payment_method, allRows.created_at, allRows.updated_at],
            { autoCommit: true }
          );
          PaymentMethodId = newId;
        } else {
          const result = await connection.execute(
            'SELECT id FROM payment_methods WHERE method = :method',
            [allRows.payment_method]
          );
          PaymentMethodId = result.rows[0][0];
        }

        // Insertar el orden de pago con el id del método de pago
        const payment_orders_data = {
          id: allRows.id,
          order_id: allRows.order_id,
          payment_method_id: PaymentMethodId,
          status: allRows.status,
          created_at: allRows.created_at,
          updated_at: allRows.updated_at,
        };

        await connection.execute(query, payment_orders_data, { autoCommit: true });
      }

      res.json({ message: "Orden de pago insertado correctamente", user: results });
      console.log("Datos cargados:", results); // Verifica que los datos sean correctos
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el Orden de pago" });
    } finally {
      if (connection) await connection.close();
    }
  }


  // Actualizar un Orden de pago
  // Actualizar un Orden de pago
  static async update(req, res) {
    const { id } = req.params;
    const { order_id, payment_method, status, created_at, updated_at } = req.body;
    const results = [req.body];  // Colocamos los datos directamente desde el body en el array

    let connection;
    try {
      connection = await getConnection();
      // Preparar el query para actualizar
      const query = `UPDATE payments_orders
                   SET order_id = :order_id, payment_method = :payment_method, status = :status, created_at = :created_at, updated_at = :updated_at
                   WHERE id = :id`;

      // Se actualiza cada fila de los resultados
      for (const rows of results) {
        const allRows = {
          order_id: rows.order_id,
          payment_method: rows.payment_method,
          status: rows.status,
          created_at: rows.created_at ? new Date(rows.created_at) : created_at,
          updated_at: rows.updated_at ? new Date(rows.updated_at) : updated_at,
          id: id,  // ID de la URL
        };

        // Buscar si el método de pago existe, si no, insertarlo
        const searchPaymentMethod = await connection.execute(
          'SELECT * FROM payment_methods WHERE method = :payment_method',
          [allRows.payment_method]
        );

        let PaymentMethodId = 0;

        if (searchPaymentMethod.rows.length === 0) {
          const result = await connection.execute('SELECT COUNT(*) AS total FROM payment_methods');
          const total = result.rows[0][0];
          const newId = total + 1;

          await connection.execute(
            `INSERT INTO payment_methods (id, method, created_at, updated_at)
           VALUES (:id, :method, :created_at, :updated_at)`,
            [newId, allRows.payment_method, allRows.created_at, allRows.updated_at],
            { autoCommit: true }
          );
          PaymentMethodId = newId;
        } else {
          const result = await connection.execute(
            'SELECT id FROM payment_methods WHERE method = :method',
            [allRows.payment_method]
          );
          PaymentMethodId = result.rows[0][0];
        }

        // Actualizar el orden de pago con el id del método de pago
        const payment_orders_data = {
          order_id: allRows.order_id,
          payment_method_id: PaymentMethodId,
          status: allRows.status,
          created_at: allRows.created_at,
          updated_at: allRows.updated_at,
          id: allRows.id, // ID de la URL
        };

        await connection.execute(query, payment_orders_data, { autoCommit: true });
      }

      res.json({ message: "Orden de pago actualizado correctamente", user: results });
      console.log("Datos actualizados:", results); // Verifica que los datos sean correctos
    } catch (error) {
      console.error("Error en la actualización:", error);
      res.status(500).json({ error: "Error al actualizar el Orden de pago" });
    } finally {
      if (connection) await connection.close();
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
        paymentsOrdersController.insertPaymentsOrders(results);
        res.json({ data: results });  // Aquí estaba 'req.json', debe ser 'res.json'
        console.log("Datos cargados:", results); // Verifica que los datos sean correctos
      })
      .on('error', (error) => res.status(500).json({ error: "Error al cargar el archivo" }));
  }


  // functions
  static async insertPaymentsOrders(data) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO payments_orders (id, order_id, payment_method_id, status, created_at, updated_at) 
         VALUES (:id, :order_id, :payment_method_id, :status, :created_at, :updated_at)`;

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

          const searchPaymentMethod = await connection.execute('SELECT * FROM payment_methods WHERE method = :payment_method', [allRows.payment_method]);

          if (searchPaymentMethod.rows.length === 0) {
            // insertar payment_method en la base de datos;

            const result = await connection.execute(`SELECT COUNT(*) AS total FROM payment_methods`);
            const total = result.rows[0][0];
            const newId = total + 1;

            await connection.execute(
              `INSERT INTO payment_methods ( id, method, created_at, updated_at ) 
                    VALUES (:id, :method, :created_at, :updated_at)`,
              [newId, allRows.payment_method, allRows.created_at, allRows.updated_at],
              { autoCommit: true } // Asegúrate de que esto esté aquí
            );
          }

          let PaymentMethodId = 0;
          const result = await connection.execute(
            `SELECT id FROM payment_methods WHERE method = :method`,
            [allRows.payment_method]
          );

          if (result.rows.length > 0) {
            const paymentMethodId = result.rows[0][0]; // Extraer el ID
            PaymentMethodId = paymentMethodId;
            // console.log("ID encontrado:", paymentMethodId);
          }

          const payment_orders_data = {
            id: allRows.id,
            order_id: allRows.order_id,
            payment_method_id: PaymentMethodId,
            status: allRows.status,
            created_at: allRows.created_at,
            updated_at: allRows.updated_at
          }
          // console.log("Insertando datos:", allRows);
          await connection.execute(query, payment_orders_data, { autoCommit: true });
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
