const orders = [];

module.exports = {
    get: () => [...orders],
    push: (params) => orders.push(params),
    getById: (id) => orders.find(o => o.id === id) ?? null,
    deleteById: (id) => {
        const foundIndex = orders.findIndex(order => order.id === id);
        if (foundIndex === -1) return false;
        orders.splice(foundIndex, 1);
        return true;
    }
};