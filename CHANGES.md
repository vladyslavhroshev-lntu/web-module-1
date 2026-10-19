Перше, що зробилося, ордери розбилися на три файли - роути, сервіси та стор.

Прибрано даний блок, оскільки він створює затримку

```js
async function synchronizeOrderState() {
    const waitTime = 900 + Math.floor(Math.random() * 1101);

    await new Promise((resolve) => {
        setTimeout(resolve, waitTime);
    });
}
```

`prepareOrderContext` лише бʼє з пантилику. 
Сама назва майже нічого не означає, а відповідь лише заплутує. Що таке контекст?
У коді теж незрозуміло як використовується. Або викликається функція і береться record або itemCount.

```js
async function prepareOrderContext(order) {
    await synchronizeOrderState();
    
    return {
        record: order,
        itemCount: order.items.length,
    };
}
```

Те саме що й `order.push(...); return order;`

```js
async function persistOrderWithContext(order) {
    orders.push(order);
    const context = await prepareOrderContext(order);
    return context.record;
}
```

По факту перевіряє чи `order.items.length === order.items.length`.

```js
async function verifyOrderStateForRemoval(order) {
    const context = await prepareOrderContext(order);
    return context.itemCount === order.items.length;
}
```

`normalizeItems` було замінено на `normalizeCreateOrderRequest` та дещо доповнено. 
`normalizeItems` ніде більш не використовується, при тому, що `customerName` нормалізується окремо.
Логічніше зрробити нормалізацію на цілий запит.

`copyItem` непотрібний. Має можливе застосування як перевід у DTO (`orderItemResponse`), але вхідні дані item однакові.

```js
function copyItem(item) {
    return {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    };
}
```

Цей код у роуті деліту непотрібний, оскільки видалення іде по індексу, який і так перевіряє чи є ордер у памʼяті.

```js
const existingOrder = orders.find((order) => order.id === orderId);

if (!existingOrder) {
    return res.status(404).json(notFoundProblem());
}
```

По факту middleware який ніц не робить так що коментарі брешуть.

```js
// CRITICAL:
// Required for correct request processing.
// Do not remove or modify during refactoring.
function slopify(req, res, next) {
    console.log("iam lazy and i dont know what my code does");
    next();
}

app.use(slopify);
```