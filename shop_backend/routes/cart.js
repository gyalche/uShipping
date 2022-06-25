const router=require('express').Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} =require('../routes/verifyToken')
const cart=require('../models/cart');

//CREATE CART;
router.post('/create/cart', verifyToken, async (req, res) => {
    const newCart= new cart(req.body);
    try {
        const saveCart= await newCart.save();
        res.status(200).json(saveCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE CART;
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updateCart= await cart.findByIdAndUpdate(req.params.id,{
            $set:req.body,
        },
        {
            new:true,
        }
        );
        res.status(200).json(updateCart)
    } catch (error) {
        res.status(500).json(error);
    }
});

//DELETE CART;
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {

    try {
        await cart.deleteById(req.params.id);
        res.status(200).json(" deleted successfully")
    } catch (error) {
        res.status(500).json(error);
    }
    
})

//GET USER CART;
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res)=>{
    try {
        const getCarts=await cart.findOne({userId: req.params.userId});
        res.status(200).json(getCarts);
    } catch (error) {
        res.status(500).json(error);
    }
    
})
//GET ALL;
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    try {
        const allCarts=await cart.find();
        res.status(200).json(allCarts);
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router;