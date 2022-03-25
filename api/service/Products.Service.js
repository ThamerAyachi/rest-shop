const mongoose = require('mongoose');
const Product = require('../models/Product');

class ProductsService {
    constructor(){}

    saveProduct(req, res) {
        const _product = {
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        }
        if (_product.name && _product.price) {
            const product = new Product(_product);
            product.save().then(result => {
                    res.status(201).json({
                        message: 'Created product successfully',
                        createrProduct: {
                            _id: result._id,
                            name: result.name,
                            price: result.price,
                            productImage: process.env.URL + result.productImage,
                            request: {
                                type: 'GET',
                                url: process.env.URL + "products/" + result._id
                            }
                        }
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
            .select('name price _id productImage')
            .exec()
            .then(result => {
                if (result) {
                    res.status(200).json({
                        message: 'Handling GET requests to /products/id',
                        product: {
                            _id: result._id,
                            name: result.name,
                            price: result.price,
                            productImage: process.env.URL + result.productImage,
                            request: {
                                type: 'GET',
                                url: process.env.URL + "products/" + result._id
                            }
                        }
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
            .select('name price _id productImage')
            .exec()
            .then(result => {
                const response = {
                    count: result.length,
                    products: result.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            productImage: process.env.URL + doc.productImage,
                            request: {
                                type: 'GET',
                                url: process.env.URL + "products/" + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            }).catch(err => {
                res.status(500).json(errorMessage(err));
            });
    }

    deletProduct(req, res) {
        const id = req.params.id;
        Product.remove({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Product deleted',
                    request: {
                        type: 'POST',
                        url: process.env.URL + "products",
                        data: {
                            name: "String",
                            price: "Number",
                            productImage: 'file'
                        }
                    },
                    result: result
                });
            })
            .catch(err => {
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
                    message: 'Product updated',
                    request: {
                        type: 'GET',
                        url: process.env.URL + "products/" + id
                    }
                })
            }).catch(err => {
                res.status(500).json(errorMessage(err));
            });

        // ! Data send format
        // !  [ { "propName": "name", "value": "example" } ]
    }
}

const errorMessage = (err) => {
    return {error:{message: err}}
}

module.exports = ProductsService;