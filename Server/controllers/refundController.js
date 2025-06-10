import Order from "../models/OrderModel.js";
import { OrderStatus } from "../constants/orderStaus.js"; // ensure this import
// import { requestReturn } from "./checkoutController.js";
import stripe from "../utils/strip.js";
import Stripe from "stripe";
// request refund ////
export const requrestRefund = async (req, res) => {
  const { orderId, reason, userId } = req.body;

  try {
    console.log("Finding order ID:", orderId);
    const order = await Order.findById(orderId);
    console.log("Order found:", order);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    if (order.refundStatus !== OrderStatus.REFUND_NOT_REQUESTED)
      return res.status(400).json({ message: "Already requested" });

    const now = new Date();
    const deliveredAt = new Date(order.deliveredAt);
    const diffDays = (now - deliveredAt) / (1000 * 60 * 60 * 24);
    const autoApprove = diffDays <= 3;

    // Update refund object fields without overwriting entire object
    order.refund.isRequested = true;
    order.refund.isProcessed = autoApprove;
    order.refund.reason = reason;
    order.refund.refundedAt = autoApprove ? new Date() : null;
    

    // Set refund status and note from enum values exactly
    order.refundStatus = autoApprove
      ? OrderStatus.REFUND_APPROVED
      : OrderStatus.REFUND_REQUESTED;

    order.refundNote = autoApprove
      ? "Auto approved within 3 days"
      : "Pending admin approval";

    await order.save();

    return res.status(200).json({
      message: autoApprove ? "Refund auto-approved" : "Refund request sent",
      refundStatus: order.refundStatus,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const adminRefundDecision = async (req, res) => {
  try {
    const { orderId, approve, refundNote } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (!order.refund.isRequested) {
      return res.status(400).json({ error: "Refund has not been requested for this order." });
    }

    if (order.refund.isProcessed) {
      return res.status(400).json({ error: "Refund has already been processed." });
    }

    if (!approve) {
      // Admin declined the refund
      order.refund.isProcessed = true;
      order.refundStatus = OrderStatus.REFUND_DECLINED;
      order.refundNote = refundNote || "Refund declined by admin.";
      await order.save();

      return res.status(200).json({ message: "Refund request declined." });
    }

    // ✅ APPROVE Refund Logic
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: order.totalAmount * 100, 
    });

    order.refund = {
      ...order.refund,
      isProcessed: true,
      refundedAt: new Date(),
      stripeRefundId: refund.id,
      refundAmount: order.totalAmount,
    };

    order.refundStatus = OrderStatus.REFUND_APPROVED;
    order.refundNote = refundNote || "Refund approved by admin.";
    order.status = OrderStatus.CANCELLED; 

    await order.save();

    res.status(200).json({
      message: "Refund approved and processed successfully.",
      refundId: refund.id,
    });

  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ error: "Internal server error during refund processing." });
  }
};
// all detailed of refund now

export const getRefundStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).select(
      "refund refundStatus refundNote user status items totalAmount"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({
      refund: order.refund,
      refundStatus: order.refundStatus,
      refundNote: order.refundNote,
      status: order.status,
      user: order.user,
      totalAmount: order.totalAmount,
      paymentIntentId: stripePaymentIntent.id,
    });

  } catch (error) {
    return res.status(500).json({ message: "Error: " + error.message });
  }
};
