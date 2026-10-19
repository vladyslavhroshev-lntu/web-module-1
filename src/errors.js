const validationProblem = (message, details) => ({
    error: {
        code: "VALIDATION_ERROR",
        message,
        details,
    },
});

const notFoundProblem = () => ({
    error: {
        code: "ORDER_NOT_FOUND",
        message: "Order not found",
    },
});

module.exports = {
    notFoundProblem,
    validationProblem
}