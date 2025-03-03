const express = require('express');
const productsControllers = require('../controllers/productsControllers');  // Asegúrate de que la importación sea correcta

class ProductsRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();  // Llama al método routes() aquí, no a this.router()
    }

    routes() {
        this.router.get('/', productsControllers.getAll);
        this.router.get('/:id', productsControllers.getOne);
        this.router.post('/', productsControllers.store);
        this.router.put('/:id', productsControllers.update);
        this.router.delete('/:id', productsControllers.delete);
        this.router.delete('/', productsControllers.deleteAll);
    }
}

const productRoutes = new ProductsRoutes();
module.exports = productRoutes.router;