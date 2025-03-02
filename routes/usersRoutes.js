const express = require('express');
const usersController = require('../controllers/usersControllers');
const usersControllers = require('../controllers/usersControllers');

class UsersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', usersController.index);
        this.router.get('/:id', usersController.show);
        this.router.post('/', usersController.store);
        this.router.put('/:id', usersController.update);
        this.router.delete('/:id', usersController.delete);
        // this.router.get('/login', usersController.login);
    }
}

const usersRoutes = new UsersRoutes();
module.exports = usersRoutes.router;