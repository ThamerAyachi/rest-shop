const express = require('express');
const router = express.Router();
const upload = require('../middleware/ImageProduct');
const checkAuth = require('../middleware/check-auth');

const ProductsService = require('../service/Products.Service');

const productsService = new ProductsService();

router.get('/', (req, res, next) => {
    productsService.getProducts(req, res);
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    productsService.saveProduct(req, res);
});

router.get('/:id', checkAuth, (req, res, next) => {
    productsService.getProductById(req, res);
});

router.patch('/:id', checkAuth, (req, res, next) => {
    productsService.updateProduct(req, res);
});

router.delete('/:id', checkAuth, (req, res, next) => {
    productsService.deletProduct(req, res);
});

module.exports = router;