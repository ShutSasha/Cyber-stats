import Match from "./pages/Match"
import Player from "./pages/Player"
import QueyToDB from "./pages/QueyToDB"
import Team from "./pages/Team"
import Tournament from "./pages/Tournament"
import { MATCH_ROUTE, PLAYER_ROUTE, QUERY_TO_DB, TEAM_ROUTE, TOURNAMENT_ROUTE } from "./utils/consts"

export const publicRoutes = [
	{
		path: MATCH_ROUTE,
		Component: Match
	},
	{
		path: PLAYER_ROUTE,
		Component: Player
	},
	{
		path: TEAM_ROUTE,
		Component: Team
	},
	{
		path: TOURNAMENT_ROUTE,
		Component: Tournament
	},
	{
		path: QUERY_TO_DB,
		Component: QueyToDB
	}
]