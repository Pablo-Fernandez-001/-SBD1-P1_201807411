const { getConnection } = require('../db/dbConnection');

class PaymentMethodsController {
    
    static async getAll(req, res) {
        const connection = await getConnection();
        try {
            const result = await connection.execute('SELECT * FROM payment_methods');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener métodos de pago" });
        } finally {
            await connection.close();
        }
    }
    
    static async getOne(req, res) {
        const { id } = req.params;
        const connection = await getConnection();
        try {
            const result = await connection.execute('SELECT * FROM payment_methods WHERE id = :id', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Método de pago no encontrado" });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el método de pago" });
        } finally {
            await connection.close();
        }
    }

    static async dynamicQuery(req, res) {
      const { query } = req.body;
      const connection = await getConnection();
      try {
        console.log("Query:", query);
        const result = await connection.execute(query);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "No se encontraron resultados" });
        }
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: "Error al ejecutar la consulta", error });
      } finally {
        await connection.close();
      }
    }
    
    static async store(req, res) {
        const { method } = req.body;
        const connection = await getConnection();
        try {
            await connection.execute(
                'INSERT INTO payment_methods (method, created_at, updated_at) VALUES (:method, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
                [method],
                { autoCommit: true }
            );
            res.json({ message: "Método de pago insertado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al insertar el método de pago" });
        } finally {
            await connection.close();
        }
    }
    
    static async update(req, res) {
        const { id } = req.params;
        const { method } = req.body;
        const connection = await getConnection();
        try {
            await connection.execute(
                'UPDATE payment_methods SET method = :method, updated_at = CURRENT_TIMESTAMP WHERE id = :id',
                [method, id],
                { autoCommit: true }
            );
            res.json({ message: "Método de pago actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el método de pago" });
        } finally {
            await connection.close();
        }
    }
    
    static async delete(req, res) {
        const { id } = req.params;
        const connection = await getConnection();
        try {
            await connection.execute(
                'DELETE FROM payment_methods WHERE id = :id',
                [id],
                { autoCommit: true }
            );
            res.json({ message: "Método de pago eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el método de pago" });
        } finally {
            await connection.close();
        }
    }
}

module.exports = PaymentMethodsController;