const express =require('express')
const cors=require('cors')
const Connection =require('./db/Connection')
const Routes=require('./Routes/Routes')
require('dotenv').config()
const app=express()
app.use(express.json())
app.use(cors())
Connection()
app.use("/api",Routes)
app.listen(process.env.PORT,()=>console.log("Server is Started at:"+process.env.PORT))