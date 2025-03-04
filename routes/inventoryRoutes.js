const express = require('express');
const inventoryController = require('../controllers/inventoryControllers');

class InventoryRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', inventoryController.getAll);
        this.router.get('/:id', inventoryController.getOne);
        this.router.post('/', inventoryController.store);
        this.router.put('/:id', inventoryController.update);
        this.router.delete('/:id', inventoryController.delete);
        this.router.delete('/', inventoryController.deleteAll);
        // this.router.get('/login', inventoryController.login);
    }
}

const inventoryRoutes = new InventoryRoutes();
module.exports = inventoryRoutes.router;