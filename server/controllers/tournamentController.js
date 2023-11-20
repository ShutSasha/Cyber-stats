const { Tournament } = require("../models/models");
const { TourDestination } = require("../models/models");
const { Match } = require("../models/models");
const ApiError = require("../error/ApiError");

class TournamentController {
	async create(req, res) {
		let {
			tournament_name,
			tournamen_date_start,
			tournamen_date_end,
			tournament_place,
			prize_fund,
			tournament_points,
		} = req.body;
		if (!tournament_name) {
			return res.json("123");
		}
		const tournament = await Tournament.create({
			tournament_name,
			tournamen_date_start,
			tournamen_date_end,
			tournament_place,
			prize_fund,
			tournament_points,
		});
		return res.json(tournament);
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			let {
				tournament_name,
				tournamen_date_start,
				tournamen_date_end,
				tournament_place,
				prize_fund,
				tournament_points,
			} = req.body;
			const tournament = await Tournament.findOne({
				where: { tournament_id: id },
			});
			if (!tournament) {
				return next(ApiError.badRequest("Tournament not founded"));
			}
			tournament.tournament_name = tournament_name;
			tournament.tournamen_date_start = tournamen_date_start;
			tournament.tournamen_date_end = tournamen_date_end;
			tournament.tournament_place = tournament_place;
			tournament.prize_fund = prize_fund;
			tournament.tournament_points = tournament_points;
			await tournament.save();
			return res.json({ message: "Tournament was updated" });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;
			const tournament = await Tournament.findOne({
				where: { tournament_id: id },
			});
			if (!tournament) {
				return next(ApiError.badRequest("Tournament not founded"));
			}

			const relatedModels = [TourDestination, Match];
			for (let i = 0; i < relatedModels.length; i++) {
				const relatedRecords = await relatedModels[i].count({
					where: { tournamentTournamentId: id },
				});
				if (relatedRecords > 0) {
					return next(
						ApiError.badRequest(
							"Cannot delete tournament with related records"
						)
					);
				}
			}

			await tournament.destroy();
			return res.json({ message: "Tournament was deleted" });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAll(req, res) {
		const tournaments = await Tournament.findAll();
		return res.json(tournaments);
	}

	async getOne(req, res, next) {
		try {
			const { id } = req.params;
			const tournament = await Tournament.findOne({
				where: { tournament_id: id },
			});
			return res.json(tournament);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
}

module.exports = new TournamentController();
