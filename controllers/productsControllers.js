const { getConnection } = require('../db/dbConnection');

class productController {

    async index(req, res) {
        res.json('Index de proyectos');
    }

    async getAll(req, res) {
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

    async getOne(req, res) {
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

    async store(req, res) {
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

    async update(req, res) {
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

    async delete(req, res) {
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

    async deleteAll(req, res) {
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
}

module.exports = new productController();