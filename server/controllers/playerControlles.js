const ApiError = require("../error/ApiError");
const { EsportsPlayer } = require("../models/models");

class PlayerController {
	async getAll(req, res, next) {
		const players = await EsportsPlayer.findAll();
		return res.json(players);
	}

	async create(req, res, next) {
		try {
			const {
				name,
				surname,
				nickname,
				role,
				global_rating,
				role_rating,
				esports_player_points,
				date_of_birth,
				teamTeamId,
			} = req.body;
			const player = await EsportsPlayer.create({
				name,
				surname,
				nickname,
				role,
				global_rating,
				role_rating,
				esports_player_points,
				date_of_birth,
				teamTeamId,
			});

			return res.json(player);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			let {
				name,
				surname,
				nickname,
				role,
				global_rating,
				role_rating,
				esports_player_points,
				date_of_birth,
				teamTeamId,
			} = req.body;
			const player = await EsportsPlayer.findOne({
				where: { esports_player_id: id },
			});
			if (!player) {
				return next(ApiError.badRequest("Player not founded"));
			}
			player.name = name;
			player.surname = surname;
			player.nickname = nickname;
			player.role = role;
			player.global_rating = global_rating;
			player.role_rating = role_rating;
			player.esports_player_points = esports_player_points;
			player.date_of_birth = date_of_birth;
			player.teamTeamId = teamTeamId;

			await player.save();
			return res.json({ message: "Player was updated" });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const player = await EsportsPlayer.findOne({
				where: { esports_player_id: id },
			});
			if (!player) {
				return next(ApiError.badRequest("Player not founded"));
			}
			await player.destroy();
			return res.json({ message: "Player was deleted" });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	// async getOne(req, res) {}
}

module.exports = new PlayerController();
