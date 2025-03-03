const express = require('express');
const productsController = require('../controllers/productsControllers');

class ProductsRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', productsController.getAll);
        this.router.get('/:id', productsController.getOne);
        this.router.post('/', productsController.store);
        this.router.put('/:id', productsController.update);
        this.router.delete('/:id', productsController.delete);
        this.router.delete('/', productsController.deleteAll);
    }
}

const productRoutes = new ProductsRoutes();
module.exports = productRoutes.router;
