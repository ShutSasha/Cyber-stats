const Router = require('express')
const router = new Router()
const teamController = require('../controllers/teamController')

router.post('/', teamController.create)
router.get('/', teamController.getAll)
router.get('/:id', teamController.getOne)
router.delete('/teamDel/:id', teamController.delete)
router.put('/teamEdit/:id', teamController.update)

module.exports = router