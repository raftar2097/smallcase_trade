const express = require('express');
const router = express.Router();

const Trade = require('../models/trade');
const Stock = require('../models/stock');
const helper = require("../helper/helper");

//fetch all trades 

router.get('/',async (req,res)=>{
    try{
        const trades = await Trade.find({});
        res.status(200).json(trades);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//fetch a single trade
router.get('/:tradeId',async (req,res)=>{
    try{
        const tradeId = req.params.tradeId;
        const trade = await Trade.findOne({_id:tradeId});
        if(trade){
            res.status(200).json(trade);
            return;
        }else{
            res.status(400).json({error:`Trade with ${tradeId} doesnot exist`});
            return;    
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//create a new trade
router.post('/',async (req,res)=>{
    try{
        if(!req.body){
            res.status(400).json({error: "Payload is missing"});
            return;
        }
        const {stock_symbol,quantity,price,trade_type} = req.body;
        const error = helper.requestValidator(quantity,stock_symbol,trade_type,price);
        if(error.status>0){
            res.status(error.status).json({error:error.error});
            return;
        }
        const output = await helper.createTrade(stock_symbol,quantity,price,trade_type);
        if(output.status>0){
            res.status(output.status).json({error:output.err});
            return ;
        }
        const trade = await new Trade({stock_symbol,quantity,price,trade_type}).save();
        if(trade){
            res.status(201).json(trade);   
            return;
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
        return;
    }
});


//update an existing trade

router.put('/:tradeId',async (req,res)=>{
    const {stock_symbol,quantity,trade_type,price} = req.body;
    const tradeId = req.params.tradeId;
    try{
        if(!req.body){
            res.status(400).json({error: "Payload is missing"});
            return;
        }
        let trade = await Trade.findOne({_id:tradeId});
        //check if trade with such id exists
        if(!trade){
            res.status(400).json({error:`Trade with ${tradeId} doesnot exist`});
            return;
        }
        const error = helper.requestValidator(quantity,stock_symbol,trade_type,price);
        if(error.status>0){
            res.status(error.status).json({error:error.error});
            return;
        }
        let stock = await Stock.findOne({stock_symbol:trade.stock_symbol});
        const val = await helper.deleteCreateCheck(trade,{quantity,trade_type,stock_symbol});
        if(val){
            await helper.deleteTrade(trade,stock);
            await helper.createTrade(stock_symbol,quantity,price,trade_type);
            const updateQuery = {quantity,trade_type,stock_symbol,price,updatedAt:Date.now()};
            trade = await Trade.updateOne({_id:tradeId},updateQuery);
            res.status(200).json({message:`Trade with ${tradeId} updated succesfully`});
            return;
        }
        else{
            res.status(400).json({ error: `Trade with ${tradeId} cannot be updated`});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error"});
        return;
    }
})



//delete trade route.
router.delete('/:tradeId',async(req,res)=>{
    try{
        const tradeId = req.params.tradeId;
        let trade = await Trade.findOne({"_id":tradeId});
        let stock = await Stock.findOne({stock_symbol:trade.stock_symbol});
        if(!trade){
            res.status(400).json({error:`Trade with ${tradeId} doesnot exist`});
            return;
        }
        if(helper.deleteTradeChecker(trade,stock)){
            await helper.deleteTrade(trade,stock);
            trade = await trade.delete();
            res.status(200).json({message:`Trade with ${tradeId} deleted`});
            return;
        }else{
            res.status(400).json({error:`Trade with ${tradeId} cannot be removed`});
            return;
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error"});
        return;
    }
})



module.exports = router;

