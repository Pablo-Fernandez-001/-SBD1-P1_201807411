const User = require('../models/User');

class UsersController {
  
  // Obtener todos los usuarios
  async index(req, res) {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
    }
  }

  // Obtener usuario por ID
  async show(req, res) {
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
    }
  }

  // Crear un nuevo usuario
  async store(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario', details: error.message });
    }
  }

  // Actualizar un usuario
  async update(req, res) {
    try {
      const updatedUser = await User.update(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
    }
  }

  // Eliminar un usuario
  async destroy(req, res) {
    try {
      const result = await User.delete(req.params.id);
      res.json({ message: 'Usuario eliminado con éxito', result });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
    }
  }
}

module.exports = new UsersController();
