const { Team } = require("../models/models");
const { EsportsPlayer } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const fs = require("fs");
const { Op } = require("sequelize");

class TeamController {
	async create(req, res, next) {
		try {
			const {
				team_name,
				team_country,
				date_of_creating_team,
				coach_team,
				global_rating,
				team_points,
				players,
			} = req.body;
			const { img } = req.files;
			let fileName = uuid.v4() + ".jpg";
			img.mv(path.resolve(__dirname, "..", "static", fileName));

			if (players) {
				players = JSON.parse(players);
				players.forEach((element) => {
					EsportsPlayer.create({
						name: element.name,
						surname: element.surname,
						nickname: element.nickname,
						role: element.role,
						global_rating: element.global_rating,
						role_rating: element.role_rating,
						esports_player_points: element.esports_player_points,
						date_of_birth: element.date_of_birth,
					});
				});
			}

			const team = await Team.create({
				team_name,
				team_country,
				date_of_creating_team,
				coach_team,
				global_rating,
				team_points,
				img: fileName,
			});

			return res.json(team);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const team = await Team.findOne({ where: { team_id: id } });
			if (!team) {
				return next(ApiError.badRequest("Team not founded"));
			}

			const filePath = path.resolve(__dirname, "..", "static", team.img);

			if (!filePath.includes("non-logo")) {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file: ${err}`);
					}
				});
			}

			await team.destroy();
			return res.json({ message: "Team was deleted" });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			let {
				team_name,
				team_country,
				date_of_creating_team,
				coach_team,
				global_rating,
				team_points,
			} = req.body;
			console.log(15321);
			console.log(req.files);
			let img = req.files ? req.files.img.name : null;
			const team = await Team.findOne({ where: { team_id: id } });
			if (!team) {
				return next(ApiError.badRequest("Team not founded"));
			}
			team.team_name = team_name;
			team.team_country = team_country;
			team.date_of_creating_team = date_of_creating_team;
			team.coach_team = coach_team;
			team.global_rating = global_rating;
			team.team_points = team_points;

			if (img) {
				if (team.img) {
					fs.unlinkSync(path.resolve(__dirname, "..", "static", team.img));
				}
				let fileName = uuid.v4() + ".jpg";
				req.files.img.mv(path.resolve(__dirname, "..", "static", fileName));
				team.img = fileName;
			}

			await team.save();
			return res.json({ message: "Team was updated" });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async updateImgError(req, res, next) {
		try {
			const { id } = req.params;

			let img = "non-img/non-logo.svg";
			const team = await Team.findOne({ where: { team_id: id } });
			if (!team) {
				return next(ApiError.badRequest("Team not founded"));
			}

			if (req.files && req.files.img) {
				if (team.img) {
					fs.unlink(
						path.resolve(__dirname, "..", "static", team.img),
						(err) => {
							if (err) console.error(`Error: ${err}`);
						}
					);
				}
				let fileName = uuid.v4() + ".jpg";
				await req.files.img.mv(
					path.resolve(__dirname, "..", "static", fileName)
				);
				img = fileName;
			}

			team.img = img;
			await team.save();
			return res.json({ message: "Team was updated" });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAll(req, res) {
		let { limit, page } = req.query;
		page = page || 1;
		limit = limit || 10;
		let offset = page * limit - limit;
		const teams = await Team.findAndCountAll({ limit, offset });
		return res.json(teams);
	}

	async getOne(req, res, next) {
		try {
			const { id } = req.params;
			const team = await Team.findOne({
				where: { team_id: id },
				include: [{ model: EsportsPlayer, as: "players" }],
			});
			return res.json(team);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
}

module.exports = new TeamController();
