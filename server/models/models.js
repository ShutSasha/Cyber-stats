const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Tournament = sequelize.define('tournament', {
	tourament_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	tournament_name: { type: DataTypes.STRING },
	tournamen_date_start: { type: DataTypes.DATE },
	tournamen_date_end: { type: DataTypes.DATE },
	tournament_place: { type: DataTypes.STRING },
	prize_fund: { type: DataTypes.INTEGER },
	tournament_points: { type: DataTypes.INTEGER }
})

const Match = sequelize.define('match', {
	match_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	match_date: { type: DataTypes.DATE },
	result: { type: DataTypes.BOOLEAN },
	match_points: { type: DataTypes.INTEGER }
})

const Team = sequelize.define('team', {
	team_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	team_name: { type: DataTypes.STRING },
	team_country: { type: DataTypes.STRING },
	date_of_creating_team: { type: DataTypes.DATE },
	coach_team: { type: DataTypes.STRING },
	global_rating: { type: DataTypes.INTEGER },
	team_points: { type: DataTypes.INTEGER },
	img: { type: DataTypes.STRING }
})

const EsportsPlayer = sequelize.define('esports_player', {
	esports_player_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING },
	surname: { type: DataTypes.STRING },
	nickname: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING },
	global_rating: { type: DataTypes.FLOAT },
	role_rating: { type: DataTypes.FLOAT },
	esports_player_points: { type: DataTypes.INTEGER },
	date_of_birth: { type: DataTypes.DATE }
})

const TourDestination = sequelize.define('tour_destination', {
	tour_destination_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

Tournament.belongsToMany(Team, { through: TourDestination })
Team.belongsToMany(Tournament, { through: TourDestination })

Tournament.hasMany(Match)
Match.belongsTo(Tournament)

Team.hasOne(Match)
Match.hasMany(Team)

Team.hasMany(EsportsPlayer, { as: 'players' })
EsportsPlayer.belongsTo(Team)

module.exports = {
	Tournament,
	Team,
	EsportsPlayer,
	TourDestination,
	Match
} 