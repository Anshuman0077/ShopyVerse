import Order from "../models/OrderModel.js";
import { OrderStatus } from "../constants/orderStaus.js";

export const autoUpdatedOrders = async () => {
  const now = new Date();

  // 2 मिनट पहले का टाइम
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  // 5 दिन पहले का टाइम
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

  // सारे orders जो अभी update होने हैं उन्हें एक-एक करके process करेंगे
  const ordersToUpdate = [];

  // 1) Pending से Processing (2 min से ज्यादा हुए)
  const pendingOrders = await Order.find({
    status: OrderStatus.PENDING,
    createdAt: { $lt: twoMinutesAgo }
  });

  for (const order of pendingOrders) {
    order.status = OrderStatus.PROCESSING;
    await order.save();
    console.log(`✅ Order ${order._id} status updated from PENDING to PROCESSING`);
    ordersToUpdate.push(order);
  }

  // 2) Processing से Shipped (2 min से ज्यादा हुए)
  const processingOrders = await Order.find({
    status: OrderStatus.PROCESSING,
    updatedAt: { $lt: twoMinutesAgo }
  });

  for (const order of processingOrders) {
    order.status = OrderStatus.SHIPPED;
    await order.save();
    console.log(`✅ Order ${order._id} status updated from PROCESSING to SHIPPED`);
    ordersToUpdate.push(order);
  }

  // 3) Shipped से Delivered (5 days से ज्यादा हुए)
  const shippedOrders = await Order.find({
    status: OrderStatus.SHIPPED,
    updatedAt: { $lt: fiveDaysAgo }
  });

  for (const order of shippedOrders) {
    order.status = OrderStatus.DELIVERED;
    await order.save();
    console.log(`✅ Order ${order._id} status updated from SHIPPED to DELIVERED`);
    ordersToUpdate.push(order);
  }

  return ordersToUpdate;
};



