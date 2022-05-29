let mongoose = require("mongoose");
const DBCounterModel = require('./db_counter')

let customerSchema = mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  last_name: {
    type: String,
  },
  first_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  address: String,
  password: {
    type: String,
    required: true,
  },
});

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

customerSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('customers_id')
  }
  next()
})

module.exports = mongoose.model("customer", customerSchema);