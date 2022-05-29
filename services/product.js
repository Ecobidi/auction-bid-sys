const ProductModel = require('../models/product')

class ProductService {
  static async findAll() {
    return ProductModel.find({}).sort('-_id').exec()
  }

  static async findById(product_id) {
    return ProductModel.findById(product_id)
  }

  static async findBySerialNumber(serial_number) {
    return ProductModel.findOne({serial_number})
  }

  static async findByCategory(category) {
    return ProductModel.find({category}).sort('-_id').exec()
  }

  static async findByName(product_name) {
    let pattern = new RegExp(product_name, 'ig')
    return ProductModel.find({name: pattern}).sort('-_id').exec()
  }

  static async save(product_dao) {
    return ProductModel.create(product_dao)
  }

  static async update(id, product_dao) {
    return ProductModel.findByIdAndUpdate(id, {$set: product_dao})
  }

  static async removeOne(serial_number) {
    return ProductModel.findOneAndDelete(serial_number)
  }

}

module.exports = ProductService