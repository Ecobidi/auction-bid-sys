const router = require('express').Router()
const Bidcontroller = require('../controllers/bid')

router.get('/', Bidcontroller.getAllBids)

module.exports = router