const Router = require('express')
const router = new Router()
const queryController = require('../controllers/queryToDB')

router.post('/', queryController.query)

module.exports = router