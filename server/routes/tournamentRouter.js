const Router = require('express')
const router = new Router()
const tournamentController = require('../controllers/tournamentController')

router.post('/', tournamentController.create)
router.get('/', tournamentController.getAll)
router.delete('/tournamentDel/:id', tournamentController.delete)

module.exports = router