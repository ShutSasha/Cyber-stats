const Router = require('express')
const router = new Router()
const matchController = require('../controllers/matchController')

router.post('/', matchController.create)
router.get('/', matchController.getAll)

module.exports = router