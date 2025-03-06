const express = require('express');
const movementsController = require('../controllers/movementsControllers');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class MovementsRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', movementsController.getAll);
        this.router.get('/:id', movementsController.getOne);
        this.router.post('/', movementsController.store);
        this.router.put('/:id', movementsController.update);
        this.router.delete('/:id', movementsController.delete);
        this.router.delete('/', movementsController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), movementsController.bulkLoad);
        // this.router.get('/login', movementsController.login);
    }
}

const movementsRoutes = new MovementsRoutes();
module.exports = movementsRoutes.router;