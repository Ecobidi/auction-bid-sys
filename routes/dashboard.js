let router = require("express").Router();
const CategoryService = require('../services/category')
const CustomerService = require('../services/customer')
const BidService = require('../services/bid')
const ProductService = require('../services/product')

router.get("/", async function(req, res) {
  let customers = await CustomerService.findAll()
  let categories = await CategoryService.findAll()
  let products = await ProductService.findAll()
  let bids = await BidService.findAll()
  let recentProducts = products.slice(0, 5)
  let recentBids = bids.slice(0, 5)

  res.render("dashboard", { recentBids, recentProducts, bids_count: bids.length, categories_count: categories.length, products_count: products.length, customers_count: customers.length
  });
});

module.exports = router;