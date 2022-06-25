const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

//body parser for;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT=process.env.PORT || 4000;

const connection_url=process.env.MONGO_URL;
mongoose.connect(connection_url,{
    useUnifiedTopology: true,
    useNewUrlParser:true
}).then((data) => {
    console.log(`mongodb is connected at: ${data.connection.host}`)
}).catch((err) => {
    console.log(err)
});
const cors=require('cors');
app.use(cors({origin:['http://localhost:4000']}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const userRoute=require("./routes/user");
app.use("/api/users",userRoute);

//calling authrouter
const authRoute=require("./routes/auth");
app.use("/api/auth",authRoute);

//calling product;
const productRoute=require("./routes/product");
app.use("/api/products",productRoute);

//calling cart;
const cartRoute=require("./routes/cart");
app.use("/api/carts",cartRoute);

//calling order;
const orderRoute=require("./routes/order");
app.use('/api/orders', orderRoute);

//calling payment route;
const stripeRoute=require("./routes/stripe");
app.use('/api/checkout', stripeRoute);
app.listen(PORT,()=>{
    console.log("backend server is listening to the port " + PORT)
})