let mongoose = require("mongoose");
const DBCounterModel = require('./db_counter')

let productSchema = mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  name: {
    required: true,
    type: String,
  },
  regular_price: {
    required: true,
    type: Number
  },
  starting_price: Number,
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  bid_end_date_time: Date,
  image: String,
  image_public_id: String,
});

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

productSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('products_id')
  }
  next()
})

module.exports = mongoose.model("product", productSchema);