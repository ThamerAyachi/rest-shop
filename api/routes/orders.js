const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrderService = require('../service/Orders.Service');

const orderService = new OrderService();

router.get('/', checkAuth, (req, res, next) => {
    orderService.getOrders(req, res);
});

router.post('/', checkAuth, (req, res, next) => {
    orderService.saveOrder(req, res);
});

router.get('/:id', checkAuth, (req, res, next) => {
    orderService.getOrderById(req, res);
});

router.delete('/:id', checkAuth, (req, res, next) => {
    orderService.deletOrder(req, res);
});

module.exports = router;