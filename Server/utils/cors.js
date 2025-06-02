import cron from "node-cron";
import Order from "../models/OrderModel";
import { OrderStatus } from "../constants/orderStaus";
import { autoUpdatedOrders } from "./autoupdated.js";


cron.schedule("0 0 * * *", async () => {
    console.log("Running daily order status update task...");
    
    // const fiveDysAgo = new Date(Date.now() -5 *24 * 60 * 60 * 1000);
    try {
        // const OrdersUpdate = await Order.find({
        //     status: OrderStatus.SHIPPED,
        //     updatedAt: { $lt: fiveDysAgo },
        // })

        // for (const order of OrdersUpdate) {
        //     order.status = OrderStatus.DELIVERED;
        //     await order.save();
        //     console.log(`Order ${order._id} status updated to DELIVERED`);
        // }

        // if (OrdersUpdate.length > 0) {   
        //     console.log(`Updated ${OrdersUpdate.length} orders to DELIVERED status.`);
        // }

        const Updated = await autoUpdatedOrders();
        console.log( 'updated orders:' , updated);
        
    } catch (error) {
        console.error("Error updating order status:", error);
        
    }
    

})