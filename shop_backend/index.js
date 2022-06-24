const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

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

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const userRoute=require("./routes/user");
app.use("/api/users",userRoute);

//calling authrouter
const authRoute=require("./routes/auth");
app.use("/api/auth",authRoute);

app.listen(PORT,()=>{
    console.log("backend server is listening to the port " + PORT)
})