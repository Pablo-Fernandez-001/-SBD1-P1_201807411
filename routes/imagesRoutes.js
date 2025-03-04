const express = require('express');
const imagesController = require('../controllers/imagesControllers');

class ImagesRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', imagesController.getAll);
        this.router.get('/:id', imagesController.getOne);
        this.router.post('/', imagesController.store);
        this.router.put('/:id', imagesController.update);
        this.router.delete('/:id', imagesController.delete);
        this.router.delete('/', imagesController.deleteAll);
        // this.router.get('/login', imagesController.login);
    }
}

const imagesRoutes = new ImagesRoutes();
module.exports = imagesRoutes.router;