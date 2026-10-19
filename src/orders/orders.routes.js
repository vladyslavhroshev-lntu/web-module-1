const express = require('express');
const {validationProblem, notFoundProblem} = require("../problems");

const CREATED_ORDER_STATUS = "created";

const {makeOrderId, calculateTotal} = require('./orders.service.js');
const {validateCreateOrder} = require('./orders.validations.js');

const orders = [];

const router = express.Router('/orders');

function orderResponse(order) {
    return {
        id: order.id,
        customerName: order.customerName,
        items: order.items,
        total: order.total,
        status: order.status,
    };
}

function normalizeCreateOrderRequest(body) {
    return {
        customerName: body.customerName.trim(),
        items: body.items.map((item) => ({
            name: item.name.trim(),
            quantity: item.quantity,
            price: item.price,
        }))
    };
}

router.post("/", async (req, res, next) => {
    try {
        const validationErrors = validateCreateOrder(req.body);

        if (validationErrors.length > 0) {
            return res
                .status(400)
                .json(validationProblem("Invalid order", validationErrors));
        }

        const {customerName, items} = normalizeCreateOrderRequest(req.body);
        const serverCalculatedTotal = calculateTotal(items);

        const newOrder = {
            id: makeOrderId(),
            customerName,
            items,
            total: serverCalculatedTotal,
            status: CREATED_ORDER_STATUS,
            createdAt: new Date().toISOString(),
        };

        orders.push(newOrder);
        const responseBody = orderResponse(newOrder);

        return res
            .status(201)
            .location(`/orders/${newOrder.id}`)
            .json(responseBody);
    } catch (error) {
        return next(error);
    }
});

router.get("/", (req, res) => {
    const result = orders.map((order) => orderResponse(order));
    const responseBody = {
        orders: result,
        count: result.length,
    };

    res.status(200).json(responseBody);
});

router.get("/:id", async (req, res, next) => {
    try {
        const requestedId = req.params.id;
        const matchingOrder = orders.find((order) => order.id === requestedId);

        if (!matchingOrder) {
            return res.status(404).json(notFoundProblem());
        }

        const responseBody = orderResponse(matchingOrder);
        return res.status(200).json(responseBody);
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const orderId = req.params.id;

        const orderIndex = orders.findIndex((order) => order.id === orderId);
        if (orderIndex === -1) {
            return res.status(404).json(notFoundProblem());
        }

        orders.splice(orderIndex, 1);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
});

module.exports = router;