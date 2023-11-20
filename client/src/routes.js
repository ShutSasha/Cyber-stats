import CompareTeams from "./pages/CompareTeams";
import Match from "./pages/Match";
import Player from "./pages/Player";
import QueyToDB from "./pages/QueyToDB";
import Team from "./pages/Team";
import TourDestination from "./pages/TourDestination";
import Tournament from "./pages/Tournament";
import {
	COMPARE_TEAMS,
	MATCH_ROUTE,
	PLAYER_ROUTE,
	QUERY_TO_DB,
	TEAM_ROUTE,
	TOURNAMENT_ROUTE,
	TOUR_DESTIONSTION,
} from "./utils/consts";

export const publicRoutes = [
	{
		path: MATCH_ROUTE,
		Component: Match,
	},
	{
		path: PLAYER_ROUTE,
		Component: Player,
	},
	{
		path: TEAM_ROUTE,
		Component: Team,
	},
	{
		path: TOURNAMENT_ROUTE,
		Component: Tournament,
	},
	{
		path: QUERY_TO_DB,
		Component: QueyToDB,
	},
	{
		path: TOUR_DESTIONSTION,
		Component: TourDestination,
	},
	{
		path: COMPARE_TEAMS,
		Component: CompareTeams,
	},
];
