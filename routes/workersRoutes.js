const express = require('express');
const workersController = require('../controllers/workersControllers');

class UsersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', workersController.getAll);
        this.router.get('/:id', workersController.getOne);
        this.router.post('/', workersController.store);
        this.router.put('/:id', workersController.update);
        this.router.delete('/:id', workersController.delete);
        this.router.delete('/', workersController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), workersController.bulkLoad);
        // this.router.get('/login', workersController.login);
    }
}

const usersRoutes = new UsersRoutes();
module.exports = usersRoutes.router;