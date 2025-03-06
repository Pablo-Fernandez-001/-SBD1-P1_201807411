const express = require('express');
const productsOrdersController = require('../controllers/productsOrdersControllers');

class ProductsOrdersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', productsOrdersController.getAll);
        this.router.get('/:id', productsOrdersController.getOne);
        this.router.post('/', productsOrdersController.store);
        this.router.put('/:id', productsOrdersController.update);
        this.router.delete('/:id', productsOrdersController.delete);
        this.router.delete('/', productsOrdersController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), productsOrdersController.bulkLoad);
        // this.router.get('/login', productsOrdersController.login);
    }
}

const productsOrdersRoutes = new ProductsOrdersRoutes();
module.exports = productsOrdersRoutes.router;