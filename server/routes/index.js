const Router = require('express')
const router = new Router()
const esportsPlayerRouter = require('./esportsPlayerRouter')
const matchRouter = require('./matchRouter')
const teamRouter = require('./teamRouter')
const tournamentRouter = require('./tournamentRouter')

router.use('/player', esportsPlayerRouter)
router.use('/match', matchRouter)
router.use('/team', teamRouter)
router.use('/tournament', tournamentRouter)

module.exports = router