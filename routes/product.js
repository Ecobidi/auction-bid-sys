const multer = require('multer')
const router = require('express').Router()

const ProductController = require('../controllers/product')

const upload = multer({})

router.get('/', ProductController.getAllProductsPage)

router.get('/new', ProductController.createProductPage)

router.post('/new', upload.single('image'), ProductController.createProduct);

router.get('/update/:product_serial_number', ProductController.updateProductPage)

router.post('/update/:product_serial_number', upload.single('image'), ProductController.updateProduct)

router.get('/remove/:product_id', ProductController.removeProduct)

module.exports = router