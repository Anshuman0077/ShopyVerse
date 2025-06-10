import Order from "../models/OrderModel.js";
import { OrderStatus } from "../constants/orderStaus.js";

export const autoUpdatedOrders = async () => {
  const now = new Date();

  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

 
  const ordersToUpdate = [];

  
  const pendingOrders = await Order.find({
    status: OrderStatus.PENDING,
    createdAt: { $lt: twoMinutesAgo }
  });

  for (const order of pendingOrders) {
    order.status = OrderStatus.PROCESSING;
    await order.save();
    console.log(`Order ${order._id} status updated from PENDING to PROCESSING`);
    ordersToUpdate.push(order);
  }

  
  const processingOrders = await Order.find({
    status: OrderStatus.PROCESSING,
    updatedAt: { $lt: twoMinutesAgo }
  });

  for (const order of processingOrders) {
    order.status = OrderStatus.SHIPPED;
    await order.save();
    console.log(`Order ${order._id} status updated from PROCESSING to SHIPPED`);
    ordersToUpdate.push(order);
  }

  const shippedOrders = await Order.find({
    status: OrderStatus.SHIPPED,
    updatedAt: { $lt: fiveDaysAgo }
  });

  for (const order of shippedOrders) {
    order.status = OrderStatus.DELIVERED;
    await order.save();
    console.log(`Order ${order._id} status updated from SHIPPED to DELIVERED`);
    ordersToUpdate.push(order);
  }

  

  const refundCandidates = await Order.find({
    refund: { status: "Requested" },
    deliveredAt: { $exists: true },
  });

  const currentDate = new Date();


   for (const order of pendingRefunds) {
    const delivered = new Date(order.deliveredAt);
    const diffDays = (currentDate - delivered) / (1000 * 60 * 60 * 24);

    if (diffDays <= 3) {
      order.refund.refundStatus = "Approved";
      order.refund.isProcessed = true;
      order.refund.refundedAt = new Date();
      order.refund.refundStatus = "Auto-approved by system (cron)";

      await order.save();
      ordersToUpdate.push(order);
      console.log(`Refund auto-approved for Order ${order._id}`);
    }
   }

  return ordersToUpdate;
};



