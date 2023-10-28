require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)

// app.post('/query-to-db', async (req, res) => {
// 	const { query } = req.body;
// 	try {
// 		const result = await sequelize.query(query, { type: QueryTypes.SELECT });
// 		res.json(result);
// 	} catch (error) {
// 		res.status(400).json({ error: error.message });
// 	}
// });
// only in the end
app.use(errorHandler)


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
