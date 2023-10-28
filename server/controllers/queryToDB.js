const ApiError = require('../error/ApiError')
const { QueryTypes } = require('sequelize');
const sequelize = require('../db')

class queryToDbController {
	async query (req, res, next) {
		const { query } = req.body;
		try {
			const result = await sequelize.query(query, { type: QueryTypes.SELECT });
			res.json(result);
		} catch (error) {
			next(ApiError.badRequest(error.message))
		}
	}
}

module.exports = new queryToDbController()