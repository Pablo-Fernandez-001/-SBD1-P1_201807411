const express = require('express');
const productController = require('../controllers/productsControllers');

class ProductRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }
    router() {
        this.router.get('/', productController.getAll);
        this.router.get('/:id', productController.getOne);
        this.router.post('/', productController.store);
        this.router.put('/:id', productController.update);
        this.router.delete('/:id', productController.delete);
        this.router.delete('/', productController.deleteAll);
    }

}

const ProductRoutes = new ProductRoutes();
module.exports = ProductRoutes.router;