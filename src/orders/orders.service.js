const { randomUUID } = require("node:crypto");

function makeOrderId() {
    return `ord-${randomUUID().slice(0, 8)}`;
}

function roundMoney(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTotal(items) {
    return roundMoney(
        items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    );
}

module.exports = {
    makeOrderId,
    calculateTotal
}