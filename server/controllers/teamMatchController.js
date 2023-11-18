const ApiError = require("../error/ApiError");
const { MatchTeam } = require("../models/models");

class teamMatchDbController {
	async create(req, res, next) {
		try {
			const { match_id, team1_id, team2_id } = req.body;
			console.log(match_id);
			const matchTeam = await MatchTeam.create({
				matchMatchId: match_id,
				teamTeamId: team1_id,
				teamTeamId1: team2_id,
			});

			return res.json(matchTeam);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
	async update(req, res, next) {
		try {
			const { id } = req.params;
			const { match_id, team1_id, team2_id } = req.body;
			const matchTeam = await MatchTeam.findOne({
				where: { match_team_id: id },
			});

			if (!matchTeam) {
				return next(ApiError.badRequest("MatchTeam not found"));
			}

			const updatedMatchTeam = await MatchTeam.update(
				{
					matchMatchId: match_id,
					teamTeamId: team1_id,
					teamTeamId1: team2_id,
				},
				{
					where: { match_team_id: id },
				}
			);
			return res.json(updatedMatchTeam);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAll(req, res, next) {
		const teamMathces = await MatchTeam.findAll();
		return res.json(teamMathces);
	}
}

module.exports = new teamMatchDbController();
