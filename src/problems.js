function validationProblem(message, details) {
    return {
        error: {
            code: "VALIDATION_ERROR",
            message,
            details,
        },
    };
}

function notFoundProblem() {
    return {
        error: {
            code: "ORDER_NOT_FOUND",
            message: "Order not found",
        },
    };
}

module.exports = {
    notFoundProblem,
    validationProblem
}