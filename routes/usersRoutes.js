const express = require('express');
const usersController = require('../controllers/usersControllers');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class UsersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', usersController.getAll);
        this.router.get('/:id', usersController.getOne);
        this.router.post('/', usersController.store);
        this.router.put('/:id', usersController.update);
        this.router.delete('/:id', usersController.delete);
        this.router.delete('/', usersController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), usersController.bulkLoad);
        // this.router.get('/login', usersController.login);
    }
}

const usersRoutes = new UsersRoutes();
module.exports = usersRoutes.router;