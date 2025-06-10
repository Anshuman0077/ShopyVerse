// serverRoutes/AdminTools.js
import express from 'express';
import Order from '../models/OrderModel.js';
const router = express.Router();

router.post('/reset-order-refund', async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.refund = {
      isRequested: false,
      isProcessed: false,
      reason: "",
      refundedAt: null,
      refundStatus: "Refund Not Requested",
      refundNote: ""
    };

    await order.save();

    res.json({ message: "Refund fields reset successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
