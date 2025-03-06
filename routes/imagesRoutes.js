const express = require('express');
const imagesController = require('../controllers/imagesControllers');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

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
        this.router.post('/bulkLoad', upload.single('file'), imagesController.bulkLoad);
        // this.router.get('/login', imagesController.login);
    }
}

const imagesRoutes = new ImagesRoutes();
module.exports = imagesRoutes.router;