const mongoose = require("mongoose")
require('dotenv').config()
const CustomerSchema = new mongoose.Schema(
    {
        shopkeeperid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        customerName:{
            type:String,
            required:true
        },
        customerEmail:{
            type:String,
            required:true,
            unique:true
        },
        customerPhone:{
            type:Number,
            required:true
        },
        customerAddress:{
            type:String,
            required:true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
          Balance:{
            type:Number,
            required:true,
            default:0
        }
        
    })

const Customer= mongoose.model( process.env.MONGODB_CUSTOMERS_COLLECTION, CustomerSchema);
module.exports=Customer
