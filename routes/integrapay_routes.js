const router = require('express').Router()
const IPController = require('../controller/integrapay')

const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({extended: false})

router.get('/payment_info', urlEncodedParser, IPController.update_integrapay_details)
router.get('/token', IPController.get_token)
router.get('/test', IPController.test)

module.exports = router