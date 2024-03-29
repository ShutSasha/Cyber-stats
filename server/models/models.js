const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Tournament = sequelize.define("tournament", {
	tournament_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	tournament_name: { type: DataTypes.STRING },
	tournamen_date_start: { type: DataTypes.DATEONLY },
	tournamen_date_end: { type: DataTypes.DATEONLY },
	tournament_place: { type: DataTypes.STRING },
	prize_fund: { type: DataTypes.INTEGER },
});

const Team = sequelize.define("team", {
	team_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	team_name: { type: DataTypes.STRING },
	team_country: { type: DataTypes.STRING },
	date_of_creating_team: { type: DataTypes.DATEONLY },
	coach_team: { type: DataTypes.STRING },
	global_rating: { type: DataTypes.INTEGER },
	team_points: { type: DataTypes.INTEGER },
	img: { type: DataTypes.STRING },
});

const Match = sequelize.define("match", {
	match_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	match_date: { type: DataTypes.DATEONLY },
	result: { type: DataTypes.BOOLEAN },
	match_points: { type: DataTypes.INTEGER },
	team1_id: {
		type: DataTypes.INTEGER,
		references: {
			model: Team,
			key: "team_id",
		},
	},
	team2_id: {
		type: DataTypes.INTEGER,
		references: {
			model: Team,
			key: "team_id",
		},
	},
});

const EsportsPlayer = sequelize.define("esports_player", {
	esports_player_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: { type: DataTypes.STRING },
	surname: { type: DataTypes.STRING },
	nickname: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING },
	global_rating: { type: DataTypes.FLOAT },
	role_rating: { type: DataTypes.FLOAT },
	esports_player_points: { type: DataTypes.INTEGER },
	date_of_birth: { type: DataTypes.DATEONLY },
});

const TourDestination = sequelize.define("tour_destination", {
	tour_destination_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
});

// const MatchTeam = sequelize.define("match_team", {
// 	match_team_id: {
// 		type: DataTypes.INTEGER,
// 		primaryKey: true,
// 		autoIncrement: true,
// 	},
// });

const MatchTeam = sequelize.define("match_team", {
	match_team_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	teamTeamId: {
		type: DataTypes.INTEGER,
		references: {
			model: "teams", // назва таблиці
			key: "team_id", // поле, на яке посилається зовнішній ключ
		},
	},
	teamTeamId1: {
		type: DataTypes.INTEGER,
		references: {
			model: "teams",
			key: "team_id",
		},
	},
	matchMatchId: {
		type: DataTypes.INTEGER,
		references: {
			model: "matches",
			key: "match_id",
		},
	},
});

Match.belongsToMany(Team, { through: MatchTeam, as: "teams" });
Team.belongsToMany(Match, { through: MatchTeam, as: "matches" });

// Цей код додає поля teamTeamId1, teamTeamId2 і matchMatchId в модель MatchTeam як зовнішні ключі, які посилаються на відповідні поля в таблицях teams і matches. Зверніть увагу, що вам потрібно замінити 'teams' і 'matches' на назви ваших таблиць, а 'team_id' і 'match_id' - на назви ваших полів. Зверніть увагу, що ви повинні використовувати назви таблиць і полів, як вони визначені в базі даних.

// Також важливо пам’ятати, що Sequelize не створює автоматично обробку зовнішніх ключів для вас. Вам потрібно буде самостійно керувати цими полями, включаючи встановлення правильних значень при створенні або оновленні записів MatchTeam.

// Match.belongsToMany(Team, { through: MatchTeam, as: "teams" });
// Team.belongsToMany(Match, { through: MatchTeam, as: "matches" });

Tournament.belongsToMany(Team, { through: TourDestination });
Team.belongsToMany(Tournament, { through: TourDestination });

Tournament.hasMany(Match);
Match.belongsTo(Tournament);

Team.hasMany(EsportsPlayer, { as: "players" });
EsportsPlayer.belongsTo(Team);

module.exports = {
	Tournament,
	Team,
	EsportsPlayer,
	TourDestination,
	Match,
	MatchTeam,
};
