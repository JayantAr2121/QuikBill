const mongoose = require("mongoose")
require('dotenv').config()
const ItemsSchema = new mongoose.Schema({
    shopkeeperid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: process.env.MONGODB_USER_COLLECTION,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    }
})
const Items = mongoose.model(process.env.MONGODB_ITEM_COLLECTION, ItemsSchema)
module.exports = Items