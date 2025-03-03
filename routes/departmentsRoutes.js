const express = require('express');
const departmentsController = require('../controllers/departmentsControllers');

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
        // this.router.get('/login', departmentsController.login);
    }
}

const departmentsRoutes = new DepartmentsRoutes();
module.exports = departmentsRoutes.router;