const express = require('express');
const PaymentMethodsController = require('../controllers/paymentsMethodsControllers');

class PaymentMethodsRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.get('/', PaymentMethodsController.getAll);
        this.router.get('/:id', PaymentMethodsController.getOne);
        this.router.post('/', PaymentMethodsController.store);
        this.router.post('/dynamic', PaymentMethodsController.store);
        this.router.put('/:id', PaymentMethodsController.update);
        this.router.delete('/:id', PaymentMethodsController.delete);
    }
}

const paymentMethodsRoutes = new PaymentMethodsRoutes();
module.exports = paymentMethodsRoutes.router;
