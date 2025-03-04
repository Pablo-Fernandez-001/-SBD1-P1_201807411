const express = require('express');
const ordersController = require('../controllers/ordersControllers');

class OrdersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', ordersController.getAll);
        this.router.get('/:id', ordersController.getOne);
        this.router.post('/', ordersController.store);
        this.router.put('/:id', ordersController.update);
        this.router.delete('/:id', ordersController.delete);
        this.router.delete('/', ordersController.deleteAll);
        // this.router.get('/login', ordersController.login);
    }
}

const ordersRoutes = new OrdersRoutes();
module.exports = ordersRoutes.router;