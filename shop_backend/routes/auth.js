const router=require('express').Router();
const user=require('../models/user');
const CryptoJS = require('crypto-js');
//REGISTER;

router.post("/register", async (req, res)=>{
    const newUser=user({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),

    });
   try{
       const savedUser=await newUser.save();
        res.status(201).json(savedUser);
   }catch(e){
       res.status(500).json(e);
   }
});

//LOGIN;

router.post("/login", async (req, res) => {
    try{
        const user=await user.findOne({username:username});
        !user && res.status(401).json("Wrong username")
        const hashedPassword=CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const password=hashedPassword.toString();

        password!==req.body.password && res.status(401).json("Wrong password");
        res.status(200).json(user);
    }catch(e){
        res.status(500).json(e);
    }
})


module.exports = router;