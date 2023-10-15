const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER, // postgres
	process.env.DB_PASSWORD,
	{
		dialect: 'postgres',
		host: process.env.DB_HOST, // localhost
		port: process.env.DB_PORT
	}
)