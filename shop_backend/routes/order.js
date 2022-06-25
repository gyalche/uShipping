const router=require('express').Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} =require('../routes/verifyToken');
const order=require('../models/order');

//CREATE AND ORDER;
router.post('/', verifyToken, async (req, res)=>{
    const newOrder= new order(req.body);
    try {
        const saveOrder=await newOrder.save();
        res.status(200).json(saveOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE;
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateOrder= await order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(updateOrder)
    } catch (error) {
        res.status(500).json(error);
    }
})
//DELTE;
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await order.deleteById(req.params.id)
        res.status(200).json("sucessfully deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})
//GET USERS ORDERED;
router.get('/find/userId', verifyTokenAndAuthorization, async (req, res)=>{
    try {
        const getOrder= await order.find({userId:req.params.userId});
        res.status(200).json(getOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET ALL ORDERS;
router.get('/', verifyTokenAndAdmin, async (req, res)=>{
    try {
        const allOrders=await order.find();
        res.status(200).json(allOrders)
    } catch (error) {
        res.status(500).json(error)
    }
})

// GET MONTHLY INCOME;
router.get("/income", verifyTokenAndAdmin, async (req, res)=>{
    const date= new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth()-1))
    const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1));

    try {
        const income = await order.aggregate([
            {$match:{createdAt: {gte: previousMonth}}},
            {
                $project:{
                    month:{$month: "$createdAt"},
                    sales:"$amount"
                },
               
            },
            {
                $group:{
                    _id:"$month", 
                    total:{$sum: $sales}
                }
            }
        ]);
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;