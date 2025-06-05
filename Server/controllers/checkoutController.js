import { OrderStatus } from "../constants/orderStaus.js";
import { Order } from "../models/OrderModel.js";

export const PlaceOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, totalAmount, address } = req.body;

  try {
    // ✅ Basic Validations
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in the order" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    if (!address) {
      return res.status(400).json({ success: false, message: "Shipping address is required" });
    }

    // ✅ Create new Order
    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      address,
      status: OrderStatus.PENDING, // default status
    });

    await newOrder.save();

    console.log("✅ Order created successfully:", newOrder);

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order: newOrder,
    });

  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const requestReturn = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
         
        if(!order) {
            res.status(404).json({success: false, message:" Order not found"})
        }
         if(order.status !== OrderStatus.DELIVERED) {
            return res.status(400).json({ message: "Return only allowed for delivered orders" });
         }
         order.status = OrderStatus.RETURN_REQUESTED;
         Order.refund = {
            isRequested: true,
            reason: req.body.reason || "NO Reason Provided"
         }
         await order.save()
         res.status(200).json({message: "Return Request ", order})

        
    } catch (error) {
        res.status(500).json({ message: "Return Request " , error })
        
    }
}



export const approveRetrun = async (req, res) => {
    try {
        const order =  await Order.findById(req.params.id);

        if(!order || !order.status || !OrderStatus.RETURN_REQUESTED) {
            return res.status(400).json({ message: "No return pending"})
        } 
        order.status = OrderStatus.REFUNDED;
        order.refund.isProcessed = true;
        order.refund.refundedAt = new Date();


        await order.save();
        res.status(200).json({ message: "Return apporoved & Refunded", order})
        
    } catch (error) {
        res.status(500).json({ message: "Return approved failed" , error})
        
    }
}



//// testing devlivered //// 

// export const markOrderAsDelivered = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     order.status = OrderStatus.DELIVERED;
//     await order.save();

//     res.status(200).json({
//       message: "✅ Order manually marked as delivered",
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };