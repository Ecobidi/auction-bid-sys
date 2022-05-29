const sharp = require('sharp')

const ProductService = require('../services/product')
const CategoryService = require('../services/category')

const { removeUploadedFile, streamUpload } = require('../config/cloudinary')

class ProductController {
  static async getAllProductsPage(req, res) {
    try {
      let products = await ProductService.findAll()
      products.forEach(p => p.end_time = p.bid_end_date_time.toGMTString())
      res.render('products', { products })
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred')
      res.redirect('/products')
    }
  }

  static async createProductPage(req, res) {
    let categories = await CategoryService.findAll()
    res.render('products-new', { categories })
  }

  static async createProduct(req, res) {
    let dao = req.body
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        let { public_id, url } = await streamUpload(editedImage, 'auction-sys')
        let dao = req.body
        dao.image_public_id = public_id
        dao.image = url
      } 
      // dao.image = "/uploads/products/Grey Nike Sneakers_1625754066611.jpg"
      await ProductService.save(dao)
      req.flash('success_msg', 'Product Added')
      res.redirect('/products')
    } catch (error) {
      console.log(error)
      console.log('An Error Creating Product')
      res.redirect('/products/new')
    }
  }

  static async updateProductPage(req, res) {
    let categories = await CategoryService.findAll()
    let product = await ProductService.findBySerialNumber(req.params.product_serial_number)
    res.render('edit-product', { categories, product })
  }

  static async updateProduct(req, res) {
    let dao = req.body
    console.log('inside')
    console.log(dao)
    let oldProduct = await ProductService.findBySerialNumber(req.params.product_serial_number)
    try {
      if (!oldProduct) throw new Error('No product found')
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        // remove previous image
        await removeUploadedFile(oldProduct.image_public_id)
        let { public_id, url } = await streamUpload(editedImage, 'auction-sys')
        let dao = req.body
        dao.image = "/uploads/products/Grey Nike Sneakers_1625754066611.jpg"
        dao.image_public_id = public_id
      } 
      console.log('called')
      await ProductService.update(oldProduct._id, dao)
      req.flash('success_msg', 'Product Updated')
      res.redirect('/products')
    } catch (error) {
      console.log(error)
      console.log('An Error Updating Product')
      res.redirect('/products/new')
    }
  }

  static async removeProduct(req, res) {
    try {
      // let product = await ProductService.findById(req.params.product_id)
      // await ()
      await ProductService.removeOne(req.params.product_id)
      req.flash('success_msg', 'Product Removed')
      res.redirect('/products')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred')
      res.redirect('/products')
    }
  }
}

module.exports = ProductController