const router = require('express').Router()
const IPController = require('../controller/integrapay')

router.get('/payment_info', IPController.update_integrapay_details)

module.exports = router