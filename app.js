const express = require('express');
const app = express();

const api = require('./server/api');
const db = require('./server/db');

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

//Configure .env
require('dotenv').config();

//Set port as process.env.PORT if it is present otherwise set it to 4000
const port = process.env.PORT || 4000;

//Initiate connection with database
db.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).then(() => {
    //Handle /api with the api middleware
    app.use('/api', api);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    //Start listening on port
    app.listen(port, () => {
        console.log(`Server listening at port: ${port}`);
    });
});