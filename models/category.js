let mongoose = require("mongoose");
const DBCounterModel = require('./db_counter')

let categorySchema = mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

categorySchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('categories_id')
  }
  next()
})

module.exports = mongoose.model("category", categorySchema);