const CategoryModel = require('../models/category')

class CategoryService {
  static async findAll() {
    return CategoryModel.find({}).sort('-_id')
  }

  static async findById(id) {
    return CategoryModel.findById(id)
  }

  static async findByName(name) {
    let pattern = new RegExp(name, 'ig')
    return CategoryModel.find({name: pattern}).sort('-_id')
  }

  static async save(category_dao) {
    return CategoryModel.create(category_dao)
  }

  static async removeOne(serial_number) {
    return CategoryModel.findOneAndRemove({serial_number})
  }

}

module.exports = CategoryService