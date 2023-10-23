const ApiError = require('../error/ApiError')
const { EsportsPlayer } = require('../models/models')

class PlayerController {
	async create (req, res, next) {
		try {
			const { name, surname, nickname, role, global_rating, role_rating, esports_player_points, date_of_birth } = req.body
			const player = await EsportsPlayer.create({ name, surname, nickname, role, global_rating, role_rating, esports_player_points, date_of_birth })

			return res.json(player)
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async getAll (req, res, next) {
		const { id } = req.query

		if (!id) {
			return next(ApiError.badRequest('gani'))
		}
		res.json(id)
	}

	async getOne (req, res) {

	}
}

module.exports = new PlayerController()