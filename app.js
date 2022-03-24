const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// connect database
mongoose.connect('mongodb+srv://rest-shope:'+ process.env.MONGO_ATLAS_PW +'@cluster0.qup6q.mongodb.net/'+ process.env.MONGO_ATLAS_DB +'?retryWrites=true&w=majority')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// for CROS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Catch error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({error: {message: error.message}});
});
// end catch error


module.exports = app;