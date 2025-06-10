    import express from 'express';
    import { isAdmin, isAuthenticated } from '../middleware/AuthMiddleware.js';
    import { approveRetrun, PlaceOrder, requestReturn,} from '../controllers/checkoutController.js';
    import { adminRefundDecision, getRefundStatus, requrestRefund } from '../controllers/refundController.js';
    import { forceUpdateOrders} from '../controllers/OrderController.js';



    const router = express.Router();

    router.post('/place-order', isAuthenticated, PlaceOrder);
    router.patch('/force-update-orders', isAuthenticated, isAdmin, forceUpdateOrders);
    router.post("/:id/return" ,  isAuthenticated, requestReturn);
    router.patch("/:id/approve-return", isAuthenticated, isAdmin,  approveRetrun);
    router.post("/refund/request", isAuthenticated, requrestRefund); 

    router.post("/refund/admin-decision", isAuthenticated, isAdmin, adminRefundDecision);
    router.get("/:orderId/refund-status", isAuthenticated, isAdmin ,  getRefundStatus)
    // router.put("/:id/mark-delivered", isAuthenticated, isAdmin, markOrderAsDelivered);
    export default router;