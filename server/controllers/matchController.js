const { Match } = require('../models/models')
const ApiError = require('../error/ApiError')

class MatchController {
	async create (req, res, next) {
		try {
			const { match_date, result, match_points } = req.body
			const match = await Match.create({ match_date, result, match_points })

			return res.json(match)
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async getAll (req, res, next) {
		const matchs = await Match.findAll()
		return res.json(matchs)
	}
}

module.exports = new MatchController()