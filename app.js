const express = require('express');
const app = express();

const api = require('./server/api');
const db = require('./server/db');

//Configure .env
// require('dotenv').config();

//Set port as process.env.PORT if it is present otherwise set it to 4000
const port = process.env.PORT || 4000;

//Initiate connection with database
db.connect({
    host: process.env.DB_HOST||"cluster0.y76rw.mongodb.net",
    username: process.env.DB_USER||"raftar2097",
    password: process.env.DB_PASS||"raftar2097",
    database: process.env.DB_NAME||"myFirstDatabase"
}).then(() => {
    //Handle /api with the api middleware
    app.use('/api', api);

    //Start listening on port
    app.listen(port, () => {
        console.log(`Server listening at port: ${port}`);
    });
});