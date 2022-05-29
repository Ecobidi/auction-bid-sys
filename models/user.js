const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

const UserSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  email: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 'admin',
  },
  last_name: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true
  }
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

UserSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('users_id')
  }
  next()
})

module.exports = mongoose.model('user', UserSchema)