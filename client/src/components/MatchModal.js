import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

function MatchModal({ show, onClose, onCreate }) {
	const [matchDate, setMatchDate] = useState("");
	const [result, setResult] = useState(false);
	const [matchPoints, setMatchPoints] = useState(0);
	const [teams, setTeams] = useState([]);
	// const [team1Name, setTeam1Name] = useState("");
	// const [team2Name, setTeam2Name] = useState("");
	const [tournamentId, setTournamentId] = useState(undefined);
	const [tournaments, setTournaments] = useState([]);
	const [selectedTournament, setSelectedTournament] = useState(null);
	const [tournamentTeams, setTournamentTeams] = useState([]);
	const [team1Id, setTeam1Id] = useState(0);
	const [team2Id, setTeam2Id] = useState(0);

	const handleSubmit = (event) => {
		event.preventDefault();

		const matchData = {
			match_date: matchDate,
			result: result,
			match_points: matchPoints,
			tournamentTournamentId: tournamentId,
			team1_id: team1Id,
			team2_id: team2Id,
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

	useEffect(() => {
		if (selectedTournament) {
			axios
				.get(`http://localhost:5000/api/tour-destinations`)
				.then((response) => {
					const tourDestinations = response.data;
					const tournamentTeams = teams.filter((team) =>
						tourDestinations.some(
							(tourDestination) =>
								Number(tourDestination.teamTeamId) ===
									Number(team.team_id) &&
								Number(tourDestination.tournamentTournamentId) ===
									Number(selectedTournament.tournament_id)
						)
					);
					setTournamentTeams(tournamentTeams);
				})
				.catch((error) => {
					console.error(`Error: ${error}`);
				});
		}
	}, [selectedTournament, teams]);

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
							onChange={(e) => {
								const value = e.target.value;
								if (value !== null && value !== undefined) {
									setTournamentId(value);
									setSelectedTournament(
										tournaments.find(
											(tournament) =>
												Number(tournament.tournament_id) ===
												Number(value)
										)
									);
								} else {
									console.log("The value is null or undefined");
								}
							}}
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
					<>
						<label>
							Team 1:
							<select
								value={team1Id}
								onChange={(e) => {
									const value = e.target.value;
									console.log(value);
									if (value !== null && value !== undefined) {
										setTeam1Id(value);
									}
								}}
								disabled={
									!selectedTournament || !tournamentTeams.length
								}
							>
								<option value="">Select a team...</option>
								{tournamentTeams.map((team, index) => (
									<option key={index} value={team.team_id}>
										{team.team_name}
									</option>
								))}
							</select>
						</label>
						<label>
							Team 2:
							<select
								value={team2Id}
								onChange={(e) => {
									const value = e.target.value;
									if (value !== null && value !== undefined) {
										setTeam2Id(value);
									}
								}}
								disabled={
									!selectedTournament || !tournamentTeams.length
								}
							>
								<option value="">Select a team...</option>
								{tournamentTeams.map((team, index) => (
									<option key={index} value={team.team_id}>
										{team.team_name}
									</option>
								))}
							</select>
						</label>
					</>
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
