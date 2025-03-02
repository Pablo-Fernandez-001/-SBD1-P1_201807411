const express = require('express');
const usersController = require('../controllers/usersControllers');

class UsersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', usersController.index);
        this.router.get('/:id', usersController.index);
        this.router.get('/', usersController.index);
        this.router.get('/:id', usersController.index);
        this.router.get('/:id', usersController.index);
        this.router.get('/login', usersController.index);
    }
}

const usersRoutes = new UsersRoutes();
module.exports = usersRoutes.router;