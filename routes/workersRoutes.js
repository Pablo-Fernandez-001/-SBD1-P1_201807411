const express = require('express');
const usersController = require('../controllers/usersControllers');

class UsersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', usersController.getAll);
        this.router.get('/:id', usersController.getOne);
        this.router.post('/', usersController.store);
        this.router.put('/:id', usersController.update);
        this.router.delete('/:id', usersController.delete);
        this.router.delete('/', usersController.deleteAll);
        // this.router.get('/login', usersController.login);
    }
}

const usersRoutes = new UsersRoutes();
module.exports = usersRoutes.router;