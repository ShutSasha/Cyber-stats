import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

function MatchModal({ show, onClose, onCreate }) {
	const [matchDate, setMatchDate] = useState("");
	const [result, setResult] = useState(false);
	const [matchPoints, setMatchPoints] = useState(0);
	const [teams, setTeams] = useState([]);
	const [team1Name, setTeam1Name] = useState("");
	const [team1Coach, setTeam1Coach] = useState("");
	const [team2Name, setTeam2Name] = useState("");
	const [team2Coach, setTeam2Coach] = useState("");
	const [tournamentId, setTournamentId] = useState("");
	const [tournaments, setTournaments] = useState([]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const team1 = teams.find(
			(team) =>
				team.team_name === team1Name && team.coach_team === team1Coach
		);
		const team2 = teams.find(
			(team) =>
				team.team_name === team2Name && team.coach_team === team2Coach
		);

		const matchData = {
			match_date: matchDate,
			result: result,
			match_points: matchPoints,
			tournamentTournamentId: tournamentId,
			team1_id: team1 ? team1.team_id : null,
			team2_id: team2 ? team2.team_id : null,
		};

		onCreate(matchData);
	};

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

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/tournament")
			.then((response) => {
				setTournaments(response.data);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create match</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "10px" }}
				>
					<label>
						Tournament:
						<select
							value={tournamentId}
							onChange={(e) => setTournamentId(e.target.value)}
						>
							<option value="">Select a tournament...</option>
							{tournaments.map((tournament, index) => (
								<option key={index} value={tournament.tournament_id}>
									{tournament.tournament_name}
								</option>
							))}
						</select>
					</label>
					<label>
						Date of match:
						<input
							type="date"
							value={matchDate}
							onChange={(e) => setMatchDate(e.target.value)}
						/>
					</label>
					<label>
						Result:
						<select
							value={result}
							onChange={(e) => setResult(e.target.value)}
						>
							<option value={false}>Team 2 Wins</option>
							<option value={true}>Team 1 Wins</option>
						</select>
					</label>
					<label>
						Match points:
						<input
							type="number"
							value={matchPoints}
							onChange={(e) => setMatchPoints(e.target.value)}
						/>
					</label>

					<label>
						Coach of team 1:
						<select
							value={team1Coach}
							onChange={(e) => {
								console.log(e.target.value);
								setTeam1Coach(e.target.value);
								const selectedTeam = teams.find(
									(team) => team.coach_team === e.target.value
								);
								setTeam1Name(
									selectedTeam ? selectedTeam.team_name : ""
								);
							}}
						>
							<option value="">Выберите тренера...</option>
							{teams.map((team, index) => (
								<option key={index} value={team.coach_team}>
									{team.coach_team}
								</option>
							))}
						</select>
					</label>
					<label>
						Name of team 1:
						<input type="text" value={team1Name} readOnly />
					</label>

					<label>
						Coach of team 2:
						<select
							value={team2Coach}
							onChange={(e) => {
								console.log(e.target.value);
								setTeam2Coach(e.target.value);
								const selectedTeam = teams.find(
									(team) => team.coach_team === e.target.value
								);
								setTeam2Name(
									selectedTeam ? selectedTeam.team_name : ""
								);
							}}
						>
							<option value="">Выберите тренера...</option>
							{teams.map((team, index) => (
								<option key={index} value={team.coach_team}>
									{team.coach_team}
								</option>
							))}
						</select>
					</label>
					<label>
						Name of team 2:
						<input type="text" value={team2Name} readOnly />
					</label>
					<input type="submit" value="Create match" />
				</form>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default MatchModal;
