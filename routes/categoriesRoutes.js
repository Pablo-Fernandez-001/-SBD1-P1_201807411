const express = require('express');
const categoriesControllers = require('../controllers/categoriesControllers');  // Asegúrate de que la importación sea correcta
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

class CategoriesRoutes {
    constructor() {
        this.router = express.Router();
        this.routes();  // Llama al método routes() aquí, no a this.router()
    }

    routes() {
        this.router.get('/', categoriesControllers.getAll);
        this.router.get('/:id', categoriesControllers.getOne);
        this.router.post('/', categoriesControllers.store);
        this.router.put('/:id', categoriesControllers.update);
        this.router.delete('/:id', categoriesControllers.delete);
        this.router.delete('/', categoriesControllers.deleteAll);
        this.router.post('/bulkLoad', upload.single('file'), categoriesControllers.bulkLoad);
    }
}

const categorieRoutes = new CategoriesRoutes();
module.exports = categorieRoutes.router;