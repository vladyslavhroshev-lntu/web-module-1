const express = require('express');
const {validationProblem, notFoundProblem} = require('../errors.js');
const {createOrder, getOrders, getOrderById, deleteOrderById} = require('./orders.service');
const {validateCreateOrder} = require('./orders.validations.js');

const router = express.Router();

const normalizeCreateOrderRequest = (body) => ({
    customerName: body.customerName.trim(),
    items: body.items.map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
        price: item.price,
    }))
});

const orderResponse = (order) => ({
    id: order.id,
    customerName: order.customerName,
    items: order.items,
    total: order.total,
    status: order.status,
});

router.post("/", (req, res, next) => {
    const validationErrors = validateCreateOrder(req.body);
    if (validationErrors.length > 0) {
        return res
            .status(400)
            .json(validationProblem("Invalid order", validationErrors));
    }

    const orderDetails = normalizeCreateOrderRequest(req.body);
    const newOrder = createOrder(orderDetails);
    const response = orderResponse(newOrder);

    return res
        .status(201)
        .location(`/orders/${newOrder.id}`)
        .json(response);
});

router.get("/", (req, res) => {
    const result = getOrders();
    const responseBody = {
        orders: result.map(o => orderResponse(o)),
        count: result.length,
    };

    res.status(200).json(responseBody);
});

router.get("/:id", (req, res, next) => {
    const requestedId = req.params.id;
    const matchingOrder = getOrderById(requestedId);

    if (matchingOrder === null) {
        return res.status(404).json(notFoundProblem());
    }

    const response = orderResponse(matchingOrder);
    return res.status(200).json(response);
});

router.delete("/:id", (req, res, next) => {
    const orderId = req.params.id;

    const status = deleteOrderById(orderId);
    if (!status) {
        return res.status(404).json(notFoundProblem());
    }

    return res.status(204).send();
});

module.exports = router;