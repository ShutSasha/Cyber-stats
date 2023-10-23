const { Tournament } = require('../models/models')
const ApiError = require('../error/ApiError')


class TournamentController {
	async create (req, res) {
		let { tournament_name, tournamen_date_start, tournamen_date_end, tournament_place, prize_fund, tournament_points } = req.body
		if (!tournament_name) {
			return res.json('123')
		}
		const tournament = await Tournament.create({ tournament_name, tournamen_date_start, tournamen_date_end, tournament_place, prize_fund, tournament_points })
		return res.json(tournament)
	}

	async getAll (req, res) {
		const tournaments = await Tournament.findAll()
		return res.json(tournaments)
	}
}

module.exports = new TournamentController()