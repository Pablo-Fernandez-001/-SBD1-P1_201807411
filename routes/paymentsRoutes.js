const express = require('express');
const paymentsControllers = require('../controllers/paymentsControllers');  // Asegúrate de que la importación sea correcta
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class PaymentsRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();  // Llama al método routes() aquí, no a this.router()
    }

    routes() {
        this.router.get('/', paymentsControllers.getAll);
        this.router.get('/:id', paymentsControllers.getOne);
        this.router.post('/', paymentsControllers.store);
        this.router.put('/:id', paymentsControllers.update);
        this.router.delete('/:id', paymentsControllers.delete);
        this.router.delete('/', paymentsControllers.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), paymentsControllers.bulkLoad);
    }
}

const paymentRoutes = new PaymentsRoutes();
module.exports = paymentRoutes.router;