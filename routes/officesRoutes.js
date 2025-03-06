const express = require('express');
const officesController = require('../controllers/officesControllers');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class OfficesRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', officesController.getAll);
        this.router.get('/:id', officesController.getOne);
        this.router.post('/', officesController.store);
        this.router.put('/:id', officesController.update);
        this.router.delete('/:id', officesController.delete);
        this.router.delete('/', officesController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), officesController.bulkLoad);
        // this.router.get('/login', officesController.login);
    }
}

const officesRoutes = new OfficesRoutes();
module.exports = officesRoutes.router;