const Trade = require('../models/trade');
const Stock = require('../models/stock');

const createTrade = async (stock_symbol,quantity,price,trade_type)=>{
    const output = {};
    output.status = 0;
    output.err = "";
    try{
        let stock = await Stock.findOne({stock_symbol});
        if(trade_type==='BUY'){
            //first time buy
            if(!stock){
                stock = new Stock({quantity,stock_symbol,trade_type,price})
                await stock.save();
            }else{
                //already present in portfolio
                stock.price = ((stock.price*stock.quantity)+(price*quantity))/(quantity+stock.quantity);
                stock.quantity = quantity+stock.quantity;
                await stock.save();
            }
        }
        else if(trade_type==='SELL'){
            //first time sell
            if(!stock){
                output.status = 400;
                output.err = `You do not have holding for this stock`;
                return output;
            }
            else if(stock){
                //amount of stock is less than stock bought
                if(stock.quantity < quantity){
                    output.status = 400;
                    output.err = `You can sell atmost ${stock.quantity} for ${stock.stock_symbol}`;
                    return output;
                }
                stock.quantity = stock.quantity - quantity;
                if(stock.quantity==0){
                    await stock.delete();
                }else{
                    await stock.save();
                }
            }
        }
    }
    catch(err){
        console.log(err);
        output.status = 500;
        output.err = `Internal Server Error`
    }
    finally{
        return output;
    }
}

const deleteTrade = async (trade,stock) => {
    try{
        if(trade.trade_type === 'BUY'){
            if(stock.quantity>=trade.quantity){
                stock.quantity = stock.quantity - trade.quantity;
                stock.price = stock.quantity>0?stock.price:0;
                if(stock.quantity==0){
                    await stock.delete();
                }
                else
                    stock = await stock.save();
            }
        }
        else{
            if(!stock){
                stock = new Stock({stock_symbol:trade.stock_symbol,quantity:trade.quantity,price:trade.price});
            }
            else{
                stock.price = ((stock.price*stock.quantity)+(trade.quantity*trade.price))/(trade.quantity+stock.quantity);
                stock.quantity = trade.quantity+stock.quantity;
            }
            await stock.save();
        }
    }
    catch(err){
        console.log(err);
        throw new Error(err.message);
    }
};

const deleteTradeChecker = (trade,stock)=>{
    if(trade.trade_type==='BUY'){
        if(!stock){
            return false;
        }
        if(stock.quantity<trade.quantity){
            return false;
        }
    }
    return true;
};

const deleteCreateCheck = async (trade,updateTrade)=>{
    let deleteStock = await Stock.findOne({stock_symbol:trade.stock_symbol});
    let createStock = null;
    //check delete flow
    if(trade.trade_type==='BUY'){
        if(!deleteStock){
            return false;
        }
        else if(deleteStock.quantity<trade.quantity){
            return false;
        }else{
            deleteStock.quantity = deleteStock.quantity-trade.quantity;
            deleteStock.price = deleteStock.quantity>0?deleteStock.price:0;
        }
    }else{
        if(!deleteStock){
            deleteStock = new Stock({stock_symbol:trade.stock_symbol,quantity:trade.quantity,price:100});
        }else{
            deleteStock.price = ((deleteStock.price*deleteStock.quantity)+(trade.quantity*100))/(trade.quantity+deleteStock.quantity);
            deleteStock.quantity = trade.quantity+deleteStock.quantity;
        }
    }
    if(deleteStock.stock_symbol===updateTrade.stock_symbol){
        createStock = deleteStock;
        if(createStock.quantity===0){
            createStock = null;
        }
    }else{
        createStock = await Stock.find({updateTrade});
    }
    //check create flow
    if(createTradeChecker(updateTrade.quantity,updateTrade.trade_type,createStock)){
        return true;
    }
    else{
        return false;
    }
}

const createTradeChecker = (quantity,trade_type,stock)=>{
    if(trade_type==='SELL'){
          if(!stock){
              return false;
          }
          if(stock.quantity < quantity){
              return false;
          }
      }
      return true;
};

const requestValidator = (quantity,stock_symbol,trade_type,price)=>{
    output = {
        error:"",
        status:0
    };    
    if(!quantity || quantity<=0 || (typeof(quantity)!=="number")){
        output.error = "Quantity is not valid";
    }
    if(!stock_symbol || (typeof(stock_symbol)!=="string")){
        output.error = "Stock_Symbol is invalid";
    }
    if(!trade_type || ((trade_type!=='BUY') && (trade_type!='SELL'))){
        output.error = "Trade_Types fomrat is not supported";
    }
    if(!price || price<0 || (typeof(price)!=="number")){
        output.error = "Currnt price format is not correct";
    }
    if(output.error.length>0)
        output.status = 400;
    return output;
}

module.exports.requestValidator = requestValidator;
module.exports.createTrade = createTrade;
module.exports.deleteTrade = deleteTrade;
module.exports.createTradeChecker = createTradeChecker;
module.exports.deleteTradeChecker = deleteTradeChecker;
module.exports.deleteCreateCheck = deleteCreateCheck;