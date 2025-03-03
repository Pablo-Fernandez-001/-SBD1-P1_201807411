const express = require('express');
const productController = require('../controllers/productsControllers');

class ProductRoutes {
    constructor() {
        this.router = express.Router();
        this.router();
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

const productsRoutes = new ProductRoutes();
module.exports = productsRoutes.router;