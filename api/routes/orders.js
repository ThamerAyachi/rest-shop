const express = require('express');
const router = express.Router();

const OrderService = require('../service/Orders.Service');

const orderService = new OrderService();

router.get('/', (req, res, next) => {
    orderService.getOrders(req, res);
});

router.post('/', (req, res, next) => {
    orderService.saveOrder(req, res);
});

router.get('/:id', (req, res, next) => {
    orderService.getOrderById(req, res);
});

router.delete('/:id', (req, res, next) => {
    orderService.deletOrder(req, res);
});

module.exports = router;