const router=require('express').Router();
const user=require('../models/user');
const CryptoJS = require('crypto-js');
const jwt=require("jsonwebtoken")
//REGISTER;

router.post("/register", async (req, res)=>{
    const newUser=new user({
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
        const User=await user.findOne({username:req.body.username});
        !User && res.status(401).json("Wrong username")

        const hashedPassword=CryptoJS.AES.decrypt(
            User.password, 
            process.env.PASS_SEC
        );
        const originalPassword=hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword=req.body.password;
        originalPassword!=inputPassword &&
         res.status(401).json("Wrong password");
        const accessToken=jwt.sign({
            id:User._id,
            isAdmin:User.isAdmin,
        }, process.env.JWT_SEC,
             {expiresIn:"3d"}
        )
         const {password, ...others}=User._doc;
        res.status(200).json({...others, accessToken});
    }catch(e){
        res.status(500).json(e);
        console.log(e)
    }
})


module.exports = router;