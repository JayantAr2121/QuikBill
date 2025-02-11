const mongoose = require("mongoose")

const BaseSchema = new mongoose.Schema(
    {
        shopkeeperId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: process.env.MONGODB_USER_COLLECTION,
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: process.env.MONGODB_CUSTOMERS_COLLECTION,
            required: true,
        },
        paymentType: {
            type: String,
            required: true,
            enum: ["credit", "debit"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { discriminatorKey: "paymentType", collection: process.env.MONGODB_TRANSACTION_COLLECTION }
);

const Transaction = mongoose.model(process.env.MONGODB_TRANSACTION_COLLECTION, BaseSchema);

const InvoiceSchema = new mongoose.Schema({
    InvoiceNo: {
        type: String,
        required: true,
    },
    OrderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: process.env.MONGODB_ORDEREDITEM_COLLECTION
        }
    ],
    TotalAmount: {
        type: Number,
        required: true,
    },
    TotalTax: {
        type: Number,
        required: true,
    },
    TotalDiscount: {
        type: Number,
        required: true,
    },
    TotalProfit: {
        type: Number,
        required: true,
    },
    Subtotal: {
        type: Number,
        required: true,
    },
});

const PaymentSchema = new mongoose.Schema({
    RecieptNo: {
        type: Number,
        required: true,
    },
    payment: {
        type: Number,
        required: true,
    },
    Description: {
        type: String,
        default: null
    }
});

const Invoice = Transaction.discriminator("credit", InvoiceSchema);
const Payment = Transaction.discriminator("debit", PaymentSchema);
module.exports = { Transaction, Invoice, Payment }