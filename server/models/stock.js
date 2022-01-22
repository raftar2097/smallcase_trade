const mongoose = require("mongoose");
const {Schema} = mongoose;

const stockSchema = new Schema({
    stock_symbol:String,
    price:Number,
    quantity:Number
})
 

module.exports = mongoose.model('Stock',stockSchema);