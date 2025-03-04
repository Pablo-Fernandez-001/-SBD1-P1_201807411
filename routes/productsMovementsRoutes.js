const express = require('express');
const productsMovementsController = require('../controllers/productsMovementsControllers');

class ProductsMovementsRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', productsMovementsController.getAll);
        this.router.get('/:id', productsMovementsController.getOne);
        this.router.post('/', productsMovementsController.store);
        this.router.put('/:id', productsMovementsController.update);
        this.router.delete('/:id', productsMovementsController.delete);
        this.router.delete('/', productsMovementsController.deleteAll);
        // this.router.get('/login', productsMovementsController.login);
    }
}

const productsMovementsRoutes = new ProductsMovementsRoutes();
module.exports = productsMovementsRoutes.router;