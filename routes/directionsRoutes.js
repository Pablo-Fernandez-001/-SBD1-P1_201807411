const express = require('express');
const directionsControllers = require('../controllers/directionsControllers');  // Asegúrate de que la importación sea correcta
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class DirectionsControllers {
    constructor() {
        this.router = express.Router();
        this.routes();  // Llama al método routes() aquí, no a this.router()
    }

    routes() {
        this.router.get('/', directionsControllers.getAll);
        this.router.get('/:id', directionsControllers.getOne);
        this.router.post('/', directionsControllers.store);
        this.router.put('/:id', directionsControllers.update);
        this.router.delete('/:id', directionsControllers.delete);
        this.router.delete('/', directionsControllers.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), directionsControllers.bulkLoad);
    }
}

const directionRoutes = new DirectionsControllers();
module.exports = directionRoutes.router;