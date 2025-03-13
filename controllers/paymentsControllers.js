const { getConnection } = require('../db/dbConnection');
const fs = require('fs');
const csv = require('csv-parser');
const oracledb = require('oracledb');

class paymentsController {

    // Obtener todos los usuarios
    static async getAll(req, res) {
        const connection = await getConnection();
        try {
            const result = await connection.execute('SELECT * FROM payments',
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
            const result = await connection.execute('SELECT * FROM payments WHERE ID = :id', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el P" });
        } finally {
            await connection.close();
        }
    }

    // Insertar un usuario
    static async store(req, res) {
        let connection;
        try {
            connection = await getConnection();
            let { id, client_id, payment_method, created_at, updated_at } = req.body;
            created_at = created_at ? new Date(created_at) : new Date();
            updated_at = updated_at ? new Date(updated_at) : new Date();

            let PaymentMethodId = 0;
            const searchPaymentMethod = await connection.execute('SELECT id FROM payment_methods WHERE method = :payment_method', [payment_method]);
            
            if (searchPaymentMethod.rows.length === 0) {
                const result = await connection.execute(`SELECT COUNT(*) AS total FROM payment_methods`);
                const total = result.rows[0][0];
                PaymentMethodId = total + 1;
                
                await connection.execute(
                    `INSERT INTO payment_methods (id, method, created_at, updated_at) 
                    VALUES (:id, :method, :created_at, :updated_at)`,
                    [PaymentMethodId, payment_method, created_at, updated_at],
                    { autoCommit: true }
                );
            } else {
                PaymentMethodId = searchPaymentMethod.rows[0][0];
            }

            await connection.execute(
                `INSERT INTO payments (id, client_id, payment_method_id, created_at, updated_at) 
                VALUES (:id, :client_id, :payment_method_id, :created_at, :updated_at)`,
                [id, client_id, PaymentMethodId, created_at, updated_at],
                { autoCommit: true }
            );
            res.json({ message: "Pago insertado correctamente" });
        } catch (error) {
            console.error("Error en la inserción:", error);
            res.status(500).json({ error: "Error al insertar el Pago" });
        } finally {
            if (connection) await connection.close();
        }
    }

    // Actualizar un usuario
    static async update(req, res) {
        const { id } = req.params;
        let { client_id, payment_method, created_at, updated_at } = req.body;
        created_at = created_at ? new Date(created_at) : created_at;
        updated_at = updated_at ? new Date(updated_at) : new Date();
        
        let connection;
        try {
            connection = await getConnection();
            
            let PaymentMethodId = 0;
            const searchPaymentMethod = await connection.execute('SELECT id FROM payment_methods WHERE method = :payment_method', [payment_method]);
            
            if (searchPaymentMethod.rows.length === 0) {
                const result = await connection.execute(`SELECT COUNT(*) AS total FROM payment_methods`);
                const total = result.rows[0][0];
                PaymentMethodId = total + 1;
                
                await connection.execute(
                    `INSERT INTO payment_methods (id, method, created_at, updated_at) 
                    VALUES (:id, :method, :created_at, :updated_at)`,
                    [PaymentMethodId, payment_method, created_at, updated_at],
                    { autoCommit: true }
                );
            } else {
                PaymentMethodId = searchPaymentMethod.rows[0][0];
            }

            await connection.execute(
                `UPDATE payments SET client_id= :client_id, payment_method_id= :payment_method_id, created_at= :created_at, updated_at= :updated_at 
                WHERE id = :id`,
                [client_id, PaymentMethodId, created_at, updated_at, id],
                { autoCommit: true }
            );
            res.json({ message: "Pago actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el pago:", error);
            res.status(500).json({ error: "Error al actualizar el Pago" });
        } finally {
            if (connection) await connection.close();
        }
    }

    // Eliminar un usuario
    static async delete(req, res) {
        const { id } = req.params;
        const connection = await getConnection();
        try {
            await connection.execute(`DELETE FROM payments 
          WHERE id = :id`, [id],
                { autoCommit: true } // Asegúrate de que esto esté aquí
            );
            res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el Pago" });
        } finally {
            await connection.close();
        }
    }

    // Eliminar todos los usuarios
    static async deleteAll(req, res) {
        const connection = await getConnection();
        try {
            await connection.execute(`DELETE FROM payments`, [], { autoCommit: true }
            );
            res.json({ message: "Todos los usuarios fueron eliminados correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar todos los Pagos" });
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
                paymentsController.insertPayments(results);
                res.json({ data: results });  // Aquí estaba 'req.json', debe ser 'res.json'
                console.log("Datos cargados:", results); // Verifica que los datos sean correctos
            })
            .on('error', (error) => res.status(500).json({ error: "Error al cargar el archivo" }));
    }


    // functions
    static async insertPayments(data) {
        let connection;
        try {
            connection = await getConnection();
            const query = `INSERT INTO payments (id, client_id, payment_method_id, created_at, updated_at) 
            VALUES (:id, :client_id, :payment_method_id, :created_at, :updated_at)`;

            for (const rows of data) {
                try {
                    const allRows = {
                        id: Number(rows._0),
                        client_id: rows._1,
                        payment_method: rows._2 ? rows._2.toLowerCase() : "unknown",
                        created_at: rows._3 ? new Date(rows._3) : new Date(),
                        updated_at: rows._4 ? new Date(rows._4) : new Date()
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

                    const payment_data = {
                        id: allRows.id,
                        client_id: allRows.client_id,
                        payment_method_id: PaymentMethodId,
                        created_at: allRows.created_at,
                        updated_at: allRows.updated_at
                    }

                    // console.log("Payment Data: ", payment_data);
                    // console.log("Insertando datos:", allRows);
                    await connection.execute(query, payment_data, { autoCommit: true });
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

module.exports = paymentsController;
