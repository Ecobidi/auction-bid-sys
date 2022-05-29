const BidModel = require('../models/bid')

class BidService {

  static async findAll() {
    return BidModel.find().populate('customer', 'product').sort('-_id').exec()
  }

  static async findById(id) {
    return BidModel.findById(id).populate('customer', 'product').sort('-_id').exec()
  }

  static async findByCustomer(customer_id) {
    return BidModel.find({customer: customer_id}).populate('customer', 'product').sort('-_id').exec()
  }

  static async findByProduct(product_serial_number) {
    return BidModel.find({product_serial_number}).populate('customer', 'product').sort('-_id').exec()
  }

  static async save(dao) {
    return BidModel.create(dao)
  }

  static async removeOne(id) {
    return BidModel.findByIdAndRemove(id)
  }

}

module.exports = BidService