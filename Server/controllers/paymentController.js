import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

import Order from "../models/OrderModel.js";

export const createPaymentIntent = async (req, res) => {
 

 try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.error("PaymentIntent Error:", error);
    return res.status(500).json({ message: error.message });
  }
};


// export default WekHook
