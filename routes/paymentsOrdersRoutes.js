const express = require('express');
const paymentsOrdersController = require('../controllers/paymentsOrdersControllers');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class PaymentsOrdersRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', paymentsOrdersController.getAll);
        this.router.get('/:id', paymentsOrdersController.getOne);
        this.router.post('/', paymentsOrdersController.store);
        this.router.put('/:id', paymentsOrdersController.update);
        this.router.delete('/:id', paymentsOrdersController.delete);
        this.router.delete('/', paymentsOrdersController.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), paymentsOrdersController.bulkLoad);
        // this.router.get('/login', paymentsOrdersController.login);
    }
}

const paymentsOrdersRoutes = new PaymentsOrdersRoutes();
module.exports = paymentsOrdersRoutes.router;