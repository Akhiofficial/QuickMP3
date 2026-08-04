import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Razorpay fields
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      default: null,  // set after successful payment
    },
    signature: {
      type: String,
      default: null,  // Razorpay signature for verification
    },
    // Plan details
    plan: {
      type: String,
      enum: ["starter", "pro_monthly", "pro_yearly"],
      required: true,
    },
    amount: {
      type: Number,   // in INR paise (e.g. 9900 = ₹99)
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    // Status lifecycle: created → paid | failed | cancelled
    status: {
      type: String,
      enum: ["created", "paid", "failed", "cancelled"],
      default: "created",
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice number before save
transactionSchema.pre("save", async function () {
  if (!this.invoiceNumber && this.status === "paid") {
    const timestamp = Date.now().toString().slice(-8);
    this.invoiceNumber = `QMP3-${timestamp}`;
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
