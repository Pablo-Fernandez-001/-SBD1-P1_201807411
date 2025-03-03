const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Routes
const { getConnection } = require('./db/dbConnection');
const usersRoutes = require('./routes/usersRoutes');
const productsRoutes = require('./routes/productsRoutes');

// Server
class Server {
    constructor() {
        this.app = express();
        this.connectDB();
        this.config();
        this.middlewares();
        this.routes();
    }

    config() {
        this.app.set('port', process.env.PORT || 3000);
    }

    async connectDB() {
        getConnection();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(morgan('combined'));
        this.app.use(cors());
    }

    routes() {
        // Auths
        // users
        this.app.use('/api/users', usersRoutes);
        // products
        this.app.use('/api/products', productsRoutes);
        // categories
        //this.app.use('/api/categories', categoriesRoutes);
        // payments
        //this.app.use('/api/categories', paymentsRoutes);
        // directions
        //this.app.use('/api/categories', directionsRoutes);
        // workers
        //this.app.use('/api/categories', workersRoutes);
        // departments
        //this.app.use('/api/categories', departmentsRoutes);
        // offices
        //this.app.use('/api/categories', officesRoutes);
        // orders
        //this.app.use('/api/categories', ordersRoutes);
        // products_orders
        //this.app.use('/api/categories', productsOrdersRoutes);
        // payments_orders
        //this.app.use('/api/categories', paymentsOrdersRoutes);
        // inventory
        //this.app.use('/api/categories', inventoryRoutes);
        // products_movements
        //this.app.use('/api/categories', productsMovementsRoutes);
        // images
        //this.app.use('/api/categories', imagesRoutes);
        // movements
        //this.app.use('/api/categories', movementsRoutes);
        // delivered_orders
        //this.app.use('/api/categories', deliveredOrdersRoutes);
        // products_devolution
        //this.app.use('/api/categories', productsDevolutionRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();