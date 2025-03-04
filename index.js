const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Routes
const { getConnection } = require('./db/dbConnection');
const usersRoutes = require('./routes/usersRoutes');
const productsRoutes = require('./routes/productsRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const directionsRoutes = require('./routes/directionsRoutes');
const workersRoutes = require('./routes/workersRoutes');
const departmentsRoutes = require('./routes/departmentsRoutes');
const officesRoutes = require('./routes/officesroutes');
const ordersRoutes = require('./routes/ordersRoutes');
const productsOrdersRoutes = require('./routes/productsOrdersRoutes');
const paymentsOrdersRoutes = require('./routes/paymentsOrdersRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const productsMovementsRoutes = require('./routes/productsMovementsRoutes');
const imagesRoutes = require('./routes/imagesRoutes');
const movementsRoutes = require('./routes/movementsRoutes');
const deliveredOrdersRoutes = require('./routes/deliveredOrdersRoutes');
const productsDevolutionRoutes = require('./routes/productsDevolutionRoutes');

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
        this.app.use('/api/categories', categoriesRoutes);
        // payments
        this.app.use('/api/payments', paymentsRoutes);
        // directions
        this.app.use('/api/directions', directionsRoutes);
        // workers
        this.app.use('/api/workers', workersRoutes);
        // departments
        this.app.use('/api/departments', departmentsRoutes);
        // offices
        this.app.use('/api/offices', officesRoutes);
        // orders
        this.app.use('/api/orders', ordersRoutes);
        // products_orders
        this.app.use('/api/productsOrders', productsOrdersRoutes);
        // payments_orders
        this.app.use('/api/paymentsOrders', paymentsOrdersRoutes);
        // inventory
        this.app.use('/api/inventory', inventoryRoutes);
        // products_movements
        this.app.use('/api/productsMovements', productsMovementsRoutes);
        // images
        this.app.use('/api/images', imagesRoutes);
        // movements
        this.app.use('/api/movements', movementsRoutes);
        // delivered_orders
        this.app.use('/api/deliveredOrders', deliveredOrdersRoutes);
        // products_devolution
        this.app.use('/api/productsDevolution', productsDevolutionRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();