const express = require('express');
const productController = require('../controllers/productsControllers');

class ProductsRoutes {
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


const productRoutes = new ProductsRoutes();
module.exports = productRoutes.router;