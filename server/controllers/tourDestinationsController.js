const ApiError = require('../error/ApiError')
const { TourDestination } = require('../models/models')

class tourDestinationsController {
	async create (req, res, next) {
		try {
			const { teamTeamId, tournamentTournamentId } = req.body
			const tour_destination = await TourDestination.create({teamTeamId, tournamentTournamentId })
			return res.json(tour_destination)
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async getAll (req, res, next) {
		try{
				const tour_destinations = await TourDestination.findAll()
				return res.json(tour_destinations)
			}
		catch(err){
			next(ApiError.badRequest(err.message))
		}
	}

	async delete (req, res, next) {
		try {
			const { id } = req.params
			const tour_destination = await TourDestination.findOne({ where: { tour_destination_id: id } })
			if (!tour_destination) {
				return next(ApiError.badRequest('Tour destination not founded'))
			}

			await tour_destination.destroy()
			return res.json({ message: 'Tour destination was deleted' })
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}

	async update (req, res, next) {
		try {
			const { id } = req.params
			let { teamTeamId, tournamentTournamentId} = req.body
			const tour_destination = await TourDestination.findOne({ where: { tour_destination_id: id } })
			if (!tour_destination) {
				return next(ApiError.badRequest('Tour destination not founded'))
			}
			tour_destination.teamTeamId = teamTeamId;
			tour_destination.tournamentTournamentId = tournamentTournamentId;

			await tour_destination.save();
			return res.json({ message: 'Tour destination was updated' })
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}
	async getByTeam (req, res, next) {
		try {
			const { teamId } = req.params
			const tour_destinations = await TourDestination.findAll({ where: { teamTeamId: teamId } })
			return res.json(tour_destinations)
		} catch(err) {
			next(ApiError.badRequest(err.message))
		}
	}
}

module.exports = new tourDestinationsController()