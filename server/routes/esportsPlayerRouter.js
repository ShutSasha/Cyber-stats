const Router = require('express')
const router = new Router()
const playerController = require('../controllers/playerControlles')

router.post('/', playerController.create)
router.get('/', playerController.getAll)
router.get('/:id', playerController.getOne) // шоб вщять отдельно конкретного гравця

module.exports = router