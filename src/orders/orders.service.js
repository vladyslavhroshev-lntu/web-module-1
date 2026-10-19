const { randomUUID } = require("node:crypto");
const orders = require('./orders.store.js');

const CREATED_ORDER_STATUS = "created";

const makeOrderId = () => `ord-${randomUUID().slice(0, 8)}`;
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const calculateTotal = (items) => roundMoney(
    items.reduce((sum, item) => sum + item.quantity * item.price, 0),
);

const createOrder = (orderDetails) => {
    const total = calculateTotal(orderDetails.items);

    const newOrder = {
        id: makeOrderId(),
        customerName: orderDetails.customerName,
        items: orderDetails.items,
        total,
        status: CREATED_ORDER_STATUS,
        createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    return newOrder;
}

const getOrders = () => orders.get();
const getOrderById = (orderId) => orders.getById(orderId);
const deleteOrderById = (orderId) => orders.deleteById(orderId);

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    deleteOrderById,
}