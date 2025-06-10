import mongoose from "mongoose";
import { OrderStatus } from "../constants/orderStaus.js";

const orderItemsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemsSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippedAddress: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(OrderStatus),
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    paymentIntentId: {
      type: String,
      required: true, // required if payment is mandatory
    },
    refund: {
      isRequested: { type: Boolean, default: false },
      isProcessed: { type: Boolean, default: false },
      reason: { type: String },
      refundedAt: { type: Date },
      stripeRefundId: { type: String }, 
      refundAmount: { type: Number },
    },
    refundStatus: {
      type: String,
      enum: [
        OrderStatus.REFUND_NOT_REQUESTED,
        OrderStatus.REFUND_REQUESTED,
        OrderStatus.REFUND_APPROVED,
        OrderStatus.REFUND_DECLINED, ,
      ],
      default: OrderStatus.REFUND_NOT_REQUESTED,
    },
    refundNote: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Add pre-save middleware to track status changes
OrderSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    (!this.statusHistory ||
      this.statusHistory.length === 0 ||
      this.statusHistory[this.statusHistory.length - 1].status !== this.status)
  ) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
    });
  }
  next();
});

export const Order = mongoose.model("Order", OrderSchema);
export default Order;
