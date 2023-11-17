const { Match } = require('../models/models')
const ApiError = require('../error/ApiError')

class MatchController {
	async create (req, res, next) {
		try {
			const {  match_date, result, match_points, team1_id, team2_id, tournamentTournamentId } = req.body
			const match = await Match.create({  match_date, result, match_points, team1_id, team2_id, tournamentTournamentId })

			return res.json(match)
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async delete (req, res, next) {
		try {
			const { id } = req.params;
			const match = await Match.findOne({ where: { match_id: id } });

			if (!match) {
				return next(ApiError.badRequest('Match not found'));
			}

			await match.destroy();
			return res.json({ message: 'Match has been deleted' });
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async update (req, res, next) {
		try {
			const { id } = req.params;
			const { match_date, result, match_points, team1_id, team2_id, tournamentTournamentId } = req.body;
			const match = await Match.findOne({ where: { match_id: id } });

			if (!match) {
				return next(ApiError.badRequest('Match not found'));
			}

			const updatedMatch = await match.update({  match_date, result, match_points, team1_id, team2_id, tournamentTournamentId });
			return res.json(updatedMatch);
		} catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}

	async getAll (req, res, next) {
		const matches = await Match.findAll()
		return res.json(matches)
	}
}

module.exports = new MatchController()
