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

	async delete (req, res, next) {
		try {
			const { id } = req.params
			const tournament = await Tournament.findOne({ where: { tournament_id: id } })
			if (!tournament) {
				return next(ApiError.badRequest('Tournament not founded'))
			}
			await tournament.destroy()
			return res.json({ message: 'Tournament was deleted' })
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async getAll (req, res) {
		const tournaments = await Tournament.findAll()
		return res.json(tournaments)
	}
}

module.exports = new TournamentController()