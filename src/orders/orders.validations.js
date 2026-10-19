function validateCreateOrder(body) {
    const problems = [];

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        problems.push("Request body must be a JSON object");
        return problems;
    }

    if (
        typeof body.customerName !== "string" ||
        body.customerName.trim().length === 0
    ) {
        problems.push("customerName is required");
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        problems.push("At least one item is required");
        return problems;
    }

    body.items.forEach((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            problems.push(`items[${index}] must be an object`);
            return;
        }

        if (typeof item.name !== "string" || item.name.trim().length === 0) {
            problems.push(`items[${index}].name is required`);
        }

        if (
            typeof item.quantity !== "number" ||
            !Number.isFinite(item.quantity) ||
            item.quantity <= 0
        ) {
            problems.push(`items[${index}].quantity must be greater than zero`);
        }

        if (
            typeof item.price !== "number" ||
            !Number.isFinite(item.price) ||
            item.price <= 0
        ) {
            problems.push(`items[${index}].price must be greater than zero`);
        }
    });

    return problems;
}

module.exports = {
    validateCreateOrder,
};