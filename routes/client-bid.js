const router = require('express').Router()
const ClientBidController = require('../controllers/client-bid')

router.get('/login', ClientBidController.getLoginPage)

router.post('/login', ClientBidController.handleLogin)

router.get('/register', ClientBidController.getRegisterPage)

router.post('/register', ClientBidController.handleRegister)

router.use('/', (req, res, next) => {
  if (req.session.customer) next()
  else res.redirect('/bid/login')
})

router.get('/', ClientBidController.getShopHome)

router.get('/view-product/:product_serial_number', ClientBidController.getProductBidPage)

router.post('/place-bid', ClientBidController.placeBid)

router.get('/logout', ClientBidController.handleLogout)

module.exports = router