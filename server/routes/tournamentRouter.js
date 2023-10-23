const Router = require('express')
const router = new Router()
const tournamentController = require('../controllers/tournamentController')

router.post('/', tournamentController.create)
router.get('/', tournamentController.getAll)

module.exports = router