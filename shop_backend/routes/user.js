const router=require('express').Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}=require('./verifyToken');
const user=require('../models/user');
const CryptoJS = require('crypto-js');

//to update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {

    if(req.body.password){
        req.body.password=CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser=await user.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true}
    );
        res.status(500).json(updatedUser);
    } catch (error) {
        res.status(500).json(error)
    }
    
});

//TO DELETE USER;
router.delete('/:id', verifyTokenAndAuthorization, async function (req, res) {
    try {
        await user.findByIdAndDelete(req.params.id);
        res.status(200).json( "User has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET USER;
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const getUser=await user.findById(req.params.id)
        const {password, ...others}=getUser._doc;
        res.status(200).json(others)
    } catch (error) {
        
    }
})

//GET ALL USER;
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query=req.query.new;
    try {
        const users=query? await user.find().sort({_id: -1}).limit(5) : await user.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET USER STATS;
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));

    try {
        const data = await user.aggregate([
            {$match:{createdAt : {$gte:lastYear}}}, 
            {
                $project:{
                    month:{$month : "$createdAt"}
                }
            }, 
            {
                $group:{
                    _id:"$month",
                    total:{$sum: 1}
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }

})
module.exports = router;