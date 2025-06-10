import Stripe from "stripe";
import Order from "../models/OrderModel.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIP_WEBHOOK_SECRET_KEY
    );
  } catch (error) {
    console.log("webhook signature verification falied:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log("Payment succeeded", paymentIntent.id);

      const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
      if (order) {
        (order.status = "PAID"), await order.save();
        console.log("Order marked as paid in DB");
      }
      break;
    }
    case "charge.refunded": {
      const change = event.data.object;
      console.log("Refunded successeded :", change.id);
      const order = await Order.findOne({
        paymentIntentId: change.payment_intent,
      });
      if (order) {
        (order.refundStatus = "REFUND_COMPLETED"), await order.save();
        console.log("Order refund marked as completed");
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const failedIntent = event.data.object;
      console.log("❌ Payment failed:", failedIntent.id);

      const order = await Order.findOne({ paymentIntentId: failedIntent.id });
      if (order) {
        order.status = "FAILED";
        await order.save();
        console.log("❌ Order marked as FAILED in DB.");
      }
      break;
    }

    default:
      console.log(`unhandled event type ${event.type}`);  
  }

  res.status(200).json({ received: true })

  // if (event.type === "change.refund") {
  //     const change = event.data.object;

  //     try {
  //         const order = await Order.findOne({ paymentIntentId: change.payment_indent })
  //         if(!order) {
  //             console.log("Order not found for refunding charge");
  //             return res.status(404).send("Order not  found..")
  //         }

  //         order.refund.isProcessed= true
  //         order.refund.refundedAt= new Date()
  //         order.refund.stripeRefundId = change.refunds.data[0]?.id || "N/A";
  //         order.refund.refundAmount = change.amount_refunded / 100;
  //         order.refundStatus = "refund_approved"
  //         order.status = "Canncelled";

  //         await order.save()
  //         console.log("Refund handle and order updated from webhook.");

  //         res.status(200).json({received:true})
  //     } catch (error) {
  //         console.log("Error updating order:", error);
  //         res.status(200).send("Server error")

  //     }
  // } else {
  //     res.status(200).json({received: true});
  // }
};
