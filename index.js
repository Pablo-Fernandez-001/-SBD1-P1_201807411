const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Routes
const { getConnection } = require('./db/dbConnection');
const usersRoutes = require('./routes/usersRoutes');

// Server
class Server {
    constructor() {
        this.app = express();
        this.connectDB();
        this.config();
        this.routes();
        this.middlewares();
    }

    config() {
        this.app.set('port', process.env.PORT || 3000);
    }

    async connectDB() {
        getConnection();
    }

    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        // Auths
        // users
        this.app.use('/api/users', usersRoutes);
        // proyects
        // tasks
        // notes
        // bulkloads

    }

    start() {
        this.app.listen(this.app.get('port'), '0.0.0.0', () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();