const router=require('express').Router();
const product = require('../models/product');
// const product=require('../models/product');

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

//CREATE;
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct=new product(req.body);
    try {
        const savedProduct=await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
})
//UPDATE;
router.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try {
        const updateProduct=await product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{
            new:true,
        }
        );
        res.status(200).json(updateProduct);

    } catch (error) {
        res.status(500).json(error);
    }
});
//DELETE;
router.delete("/:id",verifyTokenAndAdmin, async (req, res)=>{
    try{
        await product.deleteById(req.params.id);
        res.status(200).json("product has been deleted");
    }catch(e){
        res.status(500).json(e);
    }
    

})
//GET PRODUCT;

router.get('/find/:id', async (req, res) => {
    try {
        const productFind = await product.findById(req.params.id);
        res.status(200).json(productFind);
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL PRODUCTS;
router.get('/', async (req, res) => {
    const query=req.query.new;
    const queryCategory=req.query.category;
    try {
        let products;
        if(query){
            products=await product.find().sort({createdAt: -1}).limit(1);
        }
        else if(queryCategory){
            products = await product.find({
                categories:{
                    $in:[queryCategory]
                }
            })
        }else{
            products= await product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
    
})


module.exports = router;