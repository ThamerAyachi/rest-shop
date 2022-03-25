const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderService {
    constructor() { }
    
    getOrders(req, res) {
        Order.find()
            .select('_id quantity product')
            .populate('product', 'name price')
            .exec()
            .then(result => {

                const response = {
                    count: result.length,
                    orders: result.map(doc => {
                        return {
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: process.env.URL + 'orders/' + doc._id
                            }
                        }
                    })
                }

                res.status(200).json(response);
            }).catch(err => {
                res.status(500).json(errorMessage(err))
            });
    }

    saveOrder(req, res) {
        Product.findById(req.body.productId)
            .then(product => {
                if (product) {
                    const order = new Order({
                        _id: mongoose.Types.ObjectId(),
                        quantity: req.body.quantity,
                        product: req.body.productId
                    });
                    return order.save()
                        .then(result => {
                            res.status(201).json({
                                message: 'Created product successfully',
                                OrederCreated: {
                                    _id: result._id,
                                    productId: result.product,
                                    quantity: result.quantity,
                                    request: {
                                        type: 'GET',
                                        url: process.env.URL + 'orders/' + result._id
                                    }
                                }
                            });
                        })
                }else{res.status(404).json(errorMessage("Product not found"))}
            })
            .catch(err => {
                res.status(500).json(errorMessage(err));
            });


    }

    getOrderById(req, res) {
        const id = req.params.id;
        Order.findById(id)
            .select('_id quantity productId')
            .populate('product', 'name price')
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(200).json({
                        message: 'Oreder finding',
                        order: {
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: process.env.URL + 'orders/' + doc._id
                            }
                        }
                    });
                } else { res.status(404).json(errorMessage("Order not found"));}
            })
            .catch(err => {
                res.status(500).json(errorMessage(err));
            });
    }

    deletOrder(req, res) {
        const id = req.params.id;
        Order.remove({ _id: id })
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: 'Order deleted',
                    request: {
                        type: 'POST',
                        url: process.env.URL + 'orders',
                        data: {
                            quantity: "String",
                            product: "Product ID"
                        }
                    },
                    result: doc
                });
            })
            .catch(err => {
                res.status(500).json(errorMessage(err));
            });
    }
}

const errorMessage = (err) => {
    return {error:{message: err}}
}

module.exports = OrderService;