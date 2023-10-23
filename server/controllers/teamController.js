const { Team } = require('../models/models')
const { EsportsPlayer } = require('../models/models')
const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')

class TeamController {
	async create (req, res, next) {
		try {
			const { team_name, team_country, date_of_creating_team, coach_team,
				global_rating, team_points, players } = req.body
			const { img } = req.files
			let fileName = uuid.v4() + ".jpg"
			img.mv(path.resolve(__dirname, '..', 'static', fileName))

			if (players) {
				players = JSON.parse(players)
				players.forEach(element => {
					EsportsPlayer.create({
						name: element.name,
						surname: element.surname,
						nickname: element.nickname,
						role: element.role,
						global_rating: element.global_rating,
						role_rating: element.role_rating,
						esports_player_points: element.esports_player_points,
						date_of_birth: element.date_of_birth
					})
				});
			}


			const team = await Team.create({
				team_name, team_country, date_of_creating_team, coach_team,
				global_rating, team_points, img: fileName
			})

			return res.json(team)
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}

	}

	async delete (req, res, next) {
		try {
			const { id } = req.params
			const team = await Team.findOne({ where: { team_id: id } })
			if (!team) {
				return next(ApiError.badRequest('Команда не найдена'))
			}
			await team.destroy()
			return res.json({ message: 'Команда была удалена' })
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}


	async getAll (req, res) {
		let { limit, page } = req.query
		page = page || 1
		limit = limit || 10
		let offset = page * limit - limit
		const teams = await Team.findAndCountAll({ limit, offset })
		return res.json(teams)
	}

	async getOne (req, res, next) {
		try {
			const { id } = req.params
			const team = await Team.findOne(
				{
					where: { team_id: id },
					include: [{ model: EsportsPlayer, as: 'players' }]
				},
			)
			return res.json(team)
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new TeamController()