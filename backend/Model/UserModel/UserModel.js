const mongoose=require("mongoose")
require('dotenv').config()
const BaseSchema = new mongoose.Schema(
  {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      address:{
        type: String,
        required: true,
      },
      password:{
        type:String,
        required:true
      },
      city:{
        type: String,
        required: true,
      },
      state:{
        type: String,
        required: true,
      },
      service:{
        type:Boolean,
        default:true,
      },
      role: {
        type: String,
        required: true,
        enum: ["shopkeeper","executive"]
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    { discriminatorKey: "role", collection: process.env.MONGODB_USER_COLLECTION}
  );
const User = mongoose.model( process.env.MONGODB_USER_COLLECTION, BaseSchema);

const ShopkeeperSchema = new mongoose.Schema({
    
});

const ExecutiveSchema = new mongoose.Schema({
  executiveof:{
    type:String,
    required:true
  }
});

const Shopkeeper = User.discriminator("Shopkeeper", ShopkeeperSchema);
const Executive = User.discriminator("Executive", ExecutiveSchema);
module.exports = {User,Shopkeeper,Executive}