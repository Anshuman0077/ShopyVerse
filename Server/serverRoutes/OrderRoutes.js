import express from 'express';

import {isAdmin , isAuthenticated } from '../middleware/authMiddleware.js';
import { approveRetrun, PlaceOrder, requestReturn} from '../controllers/checkoutController.js';
import { forceUpdateOrders} from '../controllers/OrderController.js';

const router = express.Router();

router.post('/place-order', isAuthenticated, PlaceOrder);
router.patch('/force-update-orders', isAuthenticated, isAdmin, forceUpdateOrders);
router.post("/:id/return" ,  isAuthenticated, requestReturn);
router.patch("/:id/approve-return", isAuthenticated, isAdmin,  approveRetrun);
// router.put("/:id/mark-delivered", isAuthenticated, isAdmin, markOrderAsDelivered);
export default router;