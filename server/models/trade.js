const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradeSchema = new Schema({
    stock_symbol:String,
    price:Number,
    quantity:Number,
    trade_type:String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Trade',tradeSchema);

