const express = require('express');
const productsDevolutionController = require('../controllers/productsDevolutionControllers');

class ProductsDevolutionRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', productsDevolutionController.getAll);
        this.router.get('/:id', productsDevolutionController.getOne);
        this.router.post('/', productsDevolutionController.store);
        this.router.put('/:id', productsDevolutionController.update);
        this.router.delete('/:id', productsDevolutionController.delete);
        this.router.delete('/', productsDevolutionController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), productsDevolutionController.bulkLoad);
        // this.router.get('/login', productsDevolutionController.login);
    }
}

const productsDevolutionRoutes = new ProductsDevolutionRoutes();
module.exports = productsDevolutionRoutes.router;