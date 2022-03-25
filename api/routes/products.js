const express = require('express');
const router = express.Router();
const upload = require('../service/ImageProduct.Service');

const ProductsService = require('../service/Products.Service');

const productsService = new ProductsService();

router.get('/', (req, res, next) => {
    productsService.getProducts(req, res);
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    productsService.saveProduct(req, res);
});

router.get('/:id', (req, res, next) => {
    productsService.getProductById(req, res);
});

router.patch('/:id', (req, res, next) => {
    productsService.updateProduct(req, res);
});

router.delete('/:id', (req, res, next) => {
    productsService.deletProduct(req, res);
});

module.exports = router;