const express = require('express');
const deliveredOrdersController = require('../controllers/deliveredOrdersControllers');

class DeliveredOrdersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', deliveredOrdersController.getAll);
        this.router.get('/:id', deliveredOrdersController.getOne);
        this.router.post('/', deliveredOrdersController.store);
        this.router.put('/:id', deliveredOrdersController.update);
        this.router.delete('/:id', deliveredOrdersController.delete);
        this.router.delete('/', deliveredOrdersController.deleteAll);
        // this.router.get('/login', deliveredOrdersController.login);
    }
}

const deliveredOrdersRoutes = new DeliveredOrdersRoutes();
module.exports = deliveredOrdersRoutes.router;