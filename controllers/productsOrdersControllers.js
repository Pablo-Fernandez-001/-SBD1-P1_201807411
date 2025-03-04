const { getConnection } = require('../db/dbConnection');

class productsOrdersController {

  // Obtener todos los Ordenes de productoss
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM products_orders');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener Ordenes de productoss" });
    } finally {
      await connection.close();
    }
  }

  // Obtener un Ordenes de productos por ID
  static async getOne(req, res) {
    const { id } = req.params; // Obtener el ID de la URL
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM products_orders WHERE ID = :id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el Ordenes de productos" });
    } finally {
      await connection.close();
    }
  }

  // insertar un Ordenes de productos
  static async store(req, res) {
    const connection = await getConnection();
    try {
      const { id, order_id, product_id, quantity, price, created_at, updated_at } = req.body;
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
        `INSERT INTO products_orders (id, order_id, product_id, quantity, price, created_at, updated_at) 
         VALUES (:id, :order_id, :product_id, :quantity, :price, :created_at, :updated_at)`,
        [id, order_id, product_id, quantity, price, created_at, updated_at],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario insertado correctamente", user: { id, order_id, product_id, quantity, price, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el Ordenes de productos" });
    }
    finally {
      await connection.close();
    }
  }

  // Actualizar un Ordenes de productos
  static async update(req, res) {
    const { id } = req.params;
    const { order_id, product_id, quantity, price, created_at, updated_at } = req.body;
    const connection = await getConnection();
    if(!created_at){
      created_at = new Date();
    }

    if(!updated_at){
      updated_at = new Date();
    }

    try {
      await connection.execute(
        `UPDATE products_orders
        SET order_id = :order_id, product_id = :product_id, quantity = :quantity, price = :price, created_at = :created_at, updated_at = :updated_at
        WHERE id = :id`,
        [ order_id, product_id, quantity, price, created_at, updated_at, id ],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el Ordenes de productos" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar un Ordenes de productos
  static async delete(req, res) {
    const { id } = req.params;
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM products_orders 
          WHERE id = :id`, [id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el Ordenes de productos" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar todos los Ordenes de productoss
  static async deleteAll(req, res) {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM products_orders`, [], { autoCommit: true }
      );
      res.json({ message: "Todos los Ordenes de productoss fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los Ordenes de productoss" });
    } finally {
      await connection.close();
    }
  }

  // Login
  static async login(req, res) {
    const { email, password } = req.body;
  }
}

module.exports = productsOrdersController;
