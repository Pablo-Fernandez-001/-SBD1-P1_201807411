const express = require('express');
const departmentsController = require('../controllers/departmentsControllers');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class DepartmentsRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', departmentsController.getAll);
        this.router.get('/:id', departmentsController.getOne);
        this.router.post('/', departmentsController.store);
        this.router.put('/:id', departmentsController.update);
        this.router.delete('/:id', departmentsController.delete);
        this.router.delete('/', departmentsController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), departmentsController.bulkLoad);
        // this.router.get('/login', departmentsController.login);
    }
}

const departmentsRoutes = new DepartmentsRoutes();
module.exports = departmentsRoutes.router;