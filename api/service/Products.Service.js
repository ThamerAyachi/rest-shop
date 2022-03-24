const mongoose = require('mongoose');
const Product = require('../models/Product');

class ProductsService {
    constructor(){}

    saveProduct(req, res) {
        const _product = {
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            price: req.body.price
        }
        if (_product.name && _product.price) {
            const product = new Product(_product);
            product.save().then(result => {
                    res.status(201).json({
                        message: 'Handling POST requests to /products',
                        createrProduct: result
                    });
                })
                .catch(err => {
                    res.status(500).json(errorMessage(err));
                });
        } else {
            res.status(500).json(errorMessage('data not found'));
        }
    }

    getProductById(req, res) {
        const id = req.params.id;
        Product.findById(id)
            .exec()
            .then(result => {
                if (result) {
                    res.status(200).json({
                        message: 'Handling GET requests to /products/id',
                        product: result
                    });                    
                } else {
                    res.status(404).json(errorMessage('product not found'));
                }

            })
            .catch(err => {
                res.status(500).json(errorMessage(err));
            });
    }

    getProducts(req, res) {
        Product.find()
            .exec()
            .then(result => {
                res.status(200).json({
                    products: result
                });
            }).catch(err => {
                res.status(500).json(errorMessage(err));
            });
    }

    deletProduct(req, res) {
        const id = req.params.id;
        Product.remove({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                console.log('test')
                res.status(500).json(errorMessage(err));
            });
    }

    updateProduct(req, res) {
        const id = req.params.id;
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value; 
        }
        Product.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                res.status(200).json({
                    result: result,
                })
            }).catch(err => {
                res.status(500).json(errorMessage(err));
            });

        /** Data send */
        /* 
            [ { "propName": "name", "value": "example" } ]
        */
    }
}

const errorMessage = (err) => {
    return {error:{message: err}}
}

module.exports = ProductsService;