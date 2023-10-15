require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const PORT = process.env.PORT || 5000;

const app = express();
app.use()

const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
		app.listen(PORT, () => console.log(`server starting on port: ${PORT}`))
	} catch (error) {
		console.log(error);
	}
}

start()
