import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Table from "react-bootstrap/esm/Table";
import TourDestination from "./TourDestination";

function TournamentMatches() {
	const { id } = useParams();
	const [matches, setMatches] = useState([]);
	const [teams, setTeams] = useState([]);
	const [tournament, setTournament] = useState(null);
	useEffect(() => {
		axios
			.get("http://localhost:5000/api/tournament")
			.then((response) => {
				const tournament = response.data.find(
					(tournament) => Number(tournament.tournament_id) === Number(id)
				);
				setTournament(tournament);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, [id]);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/match`)
			.then((response) => {
				let tournamentMatches = [];
				response.data.forEach((el) => {
					if (Number(el.tournamentTournamentId) === Number(id)) {
						tournamentMatches.push(el);
					}
				});
				setMatches(tournamentMatches);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, [id]);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/team")
			.then((response) => {
				setTeams(response.data.rows);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	return (
		<div>
			<TourDestination pageTournament={id}></TourDestination>
			{tournament && (
				<div>
					<div>
						<h1>{tournament.tournament_name}</h1>
						<p>Start Date: {tournament.tournamen_date_start}</p>
						<p>End Date: {tournament.tournamen_date_end}</p>
						<p>Place: {tournament.tournament_place}</p>
						<p>Prize Fund: {tournament.prize_fund}$</p>
						<p>Points: {tournament.tournament_points}</p>
					</div>
					<div>
						<h1>Matches for Tournament {tournament.tournament_name}</h1>
					</div>
				</div>
			)}
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Match Date</th>
						<th>Result</th>
						<th>Match Points</th>
						<th>Team 1</th>
						<th>Team 2</th>
						<th>Team 1 Image</th>
						<th>Team 2 Image</th>
					</tr>
				</thead>
				<tbody>
					{matches &&
						teams &&
						matches.map((match) => {
							const team1 = teams.find(
								(team) => team.team_id === match.team1_id
							);
							const team2 = teams.find(
								(team) => team.team_id === match.team2_id
							);

							return (
								<tr key={match.match_id}>
									<td>{match.match_date}</td>
									<td>
										{match.result ? "Team 1 Wins" : "Team 2 Wins"}
									</td>
									<td>{match.match_points}</td>
									<td>{team1?.team_name}</td>
									<td>{team2?.team_name}</td>
									{}
									<td>
										<img
											src={
												`http://localhost:5000/${team1?.img}`
													? `http://localhost:5000/${team1?.img}`
													: `none img`
											}
											alt="Team 1"
											style={{ width: "70px", height: "70px" }}
										/>
									</td>
									<td>
										<img
											src={`http://localhost:5000/${team2?.img}`}
											alt="Team 2"
											style={{ width: "70px", height: "70px" }}
										/>
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
		</div>
	);
}

export default TournamentMatches;
