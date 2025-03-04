const { getConnection } = require('../db/dbConnection');

class imagesController {

  // Obtener todos los Imagenes
  static async getAll(req, res) {
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM images');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener Imagenes" });
    } finally {
      await connection.close();
    }
  }

  // Obtener un Imagen por ID
  static async getOne(req, res) {
    const { id } = req.params; // Obtener el ID de la URL
    const connection = await getConnection();
    try {
      const result = await connection.execute('SELECT * FROM images WHERE ID = :id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Imagen no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el Imagen" });
    } finally {
      await connection.close();
    }
  }

  // insertar un Imagen
  static async store(req, res) {
    const connection = await getConnection();
    try {
      const { id, product_id, image, created_at, updated_at } = req.body;
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
        `INSERT INTO images (id, product_id, image, created_at, updated_at) 
         VALUES (:id, :product_id, :image, :created_at, :updated_at)`,
        [id, product_id, image, created_at, updated_at],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Imagen insertado correctamente", user: {id, product_id, image, created_at, updated_at } });
    } catch (error) {
      console.error("Error en la inserción:", error);
      res.status(500).json({ error: "Error al insertar el Imagen" });
    }
    finally {
      await connection.close();
    }
  }

  // Actualizar un Imagen
  static async update(req, res) {
    const { id } = req.params;
    const { product_id, image, created_at, updated_at } = req.body;
    const connection = await getConnection();
    if(!created_at){
      created_at = new Date();
    }

    if(!updated_at){
      updated_at = new Date();
    }

    try {
      await connection.execute(
        `UPDATE images
        SET product_id= :product_id, image= :image, created_at= :created_at, updated_at= :updated_at
        WHERE id = :id`,
        [product_id, image, created_at, updated_at, id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Imagen actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el Imagen" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar un Imagen
  static async delete(req, res) {
    const { id } = req.params;
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM images 
          WHERE id = :id`, [id],
        { autoCommit: true } // Asegúrate de que esto esté aquí
      );
      res.json({ message: "Imagen eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el Imagen" });
    } finally {
      await connection.close();
    }
  }

  // Eliminar todos los Imagenes
  static async deleteAll(req, res) {
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM images`, [], { autoCommit: true }
      );
      res.json({ message: "Todos los Imagenes fueron eliminados correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar todos los Imagenes" });
    } finally {
      await connection.close();
    }
  }

  // Login
  static async login(req, res) {
    const { email, password } = req.body;
  }
}

module.exports = imagesController;
