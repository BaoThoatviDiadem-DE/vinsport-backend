const orders = [];

function generateOrderId() {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `VS${random}`;
}

function createOrder(payload) {
  const order = {
    id: generateOrderId(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...payload,
  };

  orders.unshift(order);
  return order;
}

function getAllOrders() {
  return orders;
}

module.exports = {
  createOrder,
  getAllOrders,
};
