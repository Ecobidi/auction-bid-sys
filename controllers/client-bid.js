const bcryptjs = require('bcryptjs')
const BidService = require('../services/bid')
const CategoryService = require('../services/category')
const CustomerService = require('../services/customer')
const ProductService = require('../services/product')

class ShopController {
  static async getShopHome(req, res) {
    let products
    let categories = await CategoryService.findAll()
    if (req.query.category) {
      products = await ProductService.findByCategory(req.query.category)
    } else if (req.query.search) {
      products = await ProductService.findByName(req.query.search)
    } else {
      products = await ProductService.findAll()
    }
    res.render('client/bid-home', {categories, products, layout: 'shop-layout'})
  }

  static async getProductBidPage(req, res) {
    let categories = await CategoryService.findAll()
    let product = await ProductService.findBySerialNumber(req.params.product_serial_number)
    product.end_time = product.bid_end_date_time.toGMTString()
    product.bid_closed = product.bid_end_date_time <= Date.now()
    let product_bids = await BidService.findByProduct(req.params.product_serial_number)
    let highest_bid = 0
    product_bids.forEach(bid => highest_bid = bid.bid_price > highest_bid ? bid.bid_price: highest_bid)
    console.log(highest_bid)
    res.render('client/product-bid', { categories, product, product_bids, highest_bid, layout: 'shop-layout' })
  }

  static async placeBid(req, res) {
    let dao = req.body
    dao.customer = req.session.customer._id
    dao.customer_name = req.session.customer.first_name + " " + req.session.customer.last_name
    dao.time_of_bid = new Date()
    try {
      await BidService.save(dao)
      req.flash('success_msg', 'Bid Placed')
      res.redirect('/bid/view-product/' + dao.product_serial_number)
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error placing bid')
      res.redirect('/bid/view-product/' + dao.product_serial_number)
    }
  }

  static async getLoginPage(req, res) {
    res.render('client/login', {layout: 'auth-layout'})
  }

  static async handleLogin(req, res) {
    let dao = req.body
    try {
      let customer = await CustomerService.findByEmail(dao.email)
      if (!customer) {
        req.flash('error_msg', 'Bad sign in credentials')
        return res.redirect('/bid/login')
      }
      let passwordMatch = await bcryptjs.compare(dao.password, customer.password)
      if (passwordMatch == false) {
        req.flash('error_msg', 'Bad sign in credentials')
        return res.redirect('/bid/login')
      }
      req.session.customer = customer
      res.redirect('/bid')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred!')
      res.redirect('/bid/login')
    }    
  }

  static async getRegisterPage(req, res) {
    res.render('client/register', {layout: 'auth-layout'})
  }

  static async handleRegister(req, res) {
    let dao = req.body
    if (!dao.password || dao.password != dao.retype_password) {
      req.flash('error_msg', 'Matching Non-Empty Passwords Required')
      return res.redirect('/bid/register')
    }
    try {
      let existingCustomer = await CustomerService.findByEmail(dao.email)
      if (existingCustomer) {
        req.flash('error_msg', 'Email Already Exists!')
        return res.redirect('/bid/register')
      }
      dao.password = await bcryptjs.hash(dao.password, 10)
      await CustomerService.save(dao)
      res.redirect('/bid/login')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An Error Occurred')
      res.redirect('/bid/register')
    }
  }

  static async handleLogout(req, res) {
    req.session.customer = null
    res.redirect('/bid/login')
  }

}

module.exports = ShopController