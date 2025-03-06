const { getConnection } = require('../db/dbConnection');
const fs = require('fs');
const csv = require('csv-parser');
const oracledb = require('oracledb');

class productController {

    static async getAll(req, res) {
        const connection = await getConnection();
        try {
            const result = await connection.execute('SELECT * FROM products');
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener proyectos" });
        } finally {
            await connection.close();
        }
    }

    static async getOne(req, res) {
        const { id } = req.params;
        const connection = await getConnection();
        try {
            const result = await connection.execute('SELECT * FROM products WHERE ID = :id', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Proyecto no encontrado" });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el proyecto" });
        } finally {
            await connection.close();
        }
    }

    static async store(req, res) {
        const connection = await getConnection();
        try {
            const { id, sku, name, description, price, slug, category_id, active, created_at, updated_at } = req.body;
            if (!req.body) {
                return res.status(400).json({ error: "Faltan datos" });
            }
            await connection.execute(
                `INSERT INTO products (id, sku, name, description, price, slug, category_id, active, created_at, updated_at) 
                 VALUES (:id, :sku, :name, :description, :price, :slug, :category_id, :active, :created_at, :updated_at)`,
                [id, sku, name, description, price, slug, category_id, active, created_at, updated_at],
                { autoCommit: true }
            );
            res.json({ message: "Proyecto insertado correctamente", product: { id, sku, name, description, price, slug, category_id, active, created_at, updated_at } });
        } catch (error) {
            console.error("Error en la inserción:", error);
            res.status(500).json({ error: "Error al insertar el proyecto" });
        }
        finally {
            await connection.close();
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { sku, name, description, price, slug, category_id, active, created_at, updated_at } = req.body;
        const connection = await getConnection();
        if (!created_at) {
            created_at = new Date();
        }

        if (!updated_at) {
            updated_at = new Date();
        }
        try {
            await connection.execute(
                `UPDATE products SET sku = :sku, name = :name, description = :description, price = :price, slug = :slug, category_id = :category_id, active = :active, created_at = :created_at, updated_at = :updated_at WHERE id = :id`,
                [sku, name, description, price, slug, category_id, active, created_at, updated_at, id],
                { autoCommit: true }
            );
            res.json({ message: "Proyecto actualizado correctamente", product: { id, sku, name, description, price, slug, category_id, active, created_at, updated_at } });
        } catch (error) {
            console.error("Error en la actualización:", error);
            res.status(500).json({ error: "Error al actualizar el proyecto" });
        }
        finally {
            await connection.close();
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        const connection = await getConnection();
        try {
            await connection.execute('DELETE FROM products WHERE id = :id', [id], { autoCommit: true });
            res.json({ message: "Proyecto eliminado correctamente" });
        } catch (error) {
            console.error("Error en la eliminación:", error);
            res.status(500).json({ error: "Error al eliminar el proyecto" });
        }
        finally {
            await connection.close();
        }
    }

    static async deleteAll(req, res) {
        const connection = await getConnection();
        try {
            await connection.execute('DELETE FROM products', [], { autoCommit: true });
            res.json({ message: "Proyectos eliminados correctamente" });
        } catch (error) {
            console.error("Error en la eliminación:", error);
            res.status(500).json({ error: "Error al eliminar los proyectos" });
        }
        finally {
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
        productController.insertProducts(results);
        res.json({ data: results });  // Aquí estaba 'req.json', debe ser 'res.json'
      })
      .on('error', (error) => res.status(500).json({ error: "Error al cargar el archivo" }));
  }


  // functions
  static async insertProducts(data) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO products (id, sku, name, description, price, slug, category_id, active, created_at, updated_at) 
                 VALUES (:id, :sku, :name, :description, :price, :slug, :category_id, :active, :created_at, :updated_at)`;

      for (const rows of data) {
        try {
          const allRows = {
            id: Number(rows._0) || null,
            sku: rows._1,
            name: rows._2,
            description: rows._3,
            price: rows._4,
            slug: rows._5 || null,
            category_id: rows._6,
            active: rows._7,
            created_at: rows._8 ? new Date(rows._8) : new Date(),
            updated_at: rows._9 ? new Date(rows._9) : new Date()
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
}

module.exports = productController;