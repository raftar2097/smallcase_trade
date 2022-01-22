const express = require('express');
const router = express.Router();

const Stock = require('../models/stock');

router.get('/',async (req,res)=>{
    try{
        const stocks = await Stock.find({});
        res.status(200).send(stocks);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:'Internal Server Error',err});
    }
})

router.get('/return',async (req,res)=>{
    try{
        const stocks = await Stock.find({});
        let buyCost  = 0;
        let marketCost = 0;
        let data = {};
        data.Return = 0;
        data.totalReturn = 0;
        data.individualStocks = [];
        if(stocks){
            stocks.forEach((stock)=>{
                const {stock_symbol,price,quantity} = stock;
                buyCost +=(quantity)*(price);
                marketCost+=(quantity)*100;
                let indReturn = ((100-price)/price)*100;
                data.individualStocks.push({stock_symbol,return:`${indReturn.toFixed(2)}%`})
            })
        }
        let total = buyCost>0?((marketCost-buyCost)/buyCost)*100:0;
        
        if(total>0)
            total  = total.toFixed(2);

        data.totalReturn = `${total}%`;
        data.Return = marketCost - buyCost;
        res.status(200).send(data);
        return;
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:'Internal Server Error',err});
    }
})

module.exports = router;