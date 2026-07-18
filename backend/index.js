require('dotenv').config();
const express = require("express")
const app =express();
const mongoose = require("mongoose");
const cors = require("cors");
const Routes = require('./router');
const productRoutes = require('./productrouter');
const orderRoutes = require('./routes/orderRouter');
const adminRoutes = require('./routes/adminRouter');
const userRoutes  = require('./routes/userRouter');

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://AbheerKaushik:abheer02@cluster0.flsd7n2.mongodb.net/users";

mongoose.connect(MONGODB_URI).then(()=>{
    console.log('mongodb connected')
})
app.get('/ping',(req,res)=>{
    console.log('pong')
    res.send('pong')
})
app.use(cors());
app.use(express.json())
app.use('/auth',Routes)
app.use('/products',productRoutes)
app.use('/orders', orderRoutes)
app.use('/admin-api', adminRoutes)
app.use('/user', userRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})
