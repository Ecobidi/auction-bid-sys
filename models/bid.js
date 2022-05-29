let mongoose = require("mongoose");
const DBCounterModel = require('./db_counter')

let BidSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  product_name: String,
  product_serial_number: Number,
  bid_price: {
    type: Number,
  },
  time_of_bid: {
    type: Date,
    default: Date.now
  },
  customer: {
    type: String,
  },
  customer_name: {
    type: String,
  }
});

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

BidSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('bids_id')
  }
  next()
})

module.exports = mongoose.model("bid", BidSchema);