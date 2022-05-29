const router = require('express').Router()
const CustomerController = require('../controllers/customer')

router.get('/', CustomerController.getAllCustomersPage)

router.get('/remove/:customer_id', CustomerController.removeCustomer)

module.exports = router