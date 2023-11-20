import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

function EditMatchModal({ show, onClose, onUpdate, editingMatch, match }) {
	const [matchDate, setMatchDate] = useState("");
	const [result, setResult] = useState(false);
	const [matchPoints, setMatchPoints] = useState(0);
	const [team1Id, setTeam1Id] = useState(0);
	const [team2Id, setTeam2Id] = useState(0);
	const [teams, setTeams] = useState([]);
	const [tournaments, setTournaments] = useState([]);
	const [tournamentTeams, setTournamentTeams] = useState([]);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/tournament`)
			.then((response) => {
				setTournaments(response.data);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	useEffect(() => {
		if (editingMatch) {
			setMatchDate(editingMatch.match_date);
			setResult(editingMatch.result);
			setMatchPoints(editingMatch.match_points);
			setTeam1Id(editingMatch.team1_id);
			setTeam2Id(editingMatch.team2_id);
		}
	}, [editingMatch]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const team1Exists = teams.some(
			(team) => Number(team.team_id) === Number(team1Id)
		);
		const team2Exists = teams.some(
			(team) => Number(team.team_id) === Number(team2Id)
		);

		if (!team1Exists || !team2Exists) {
			alert("Одна або обидві команди не існують");
			return;
		}
		if (Number(team1Id) === Number(team2Id)) {
			alert("Команда не може грати сама проти себе");
			return;
		}

		const matchData = {
			match_date: matchDate,
			result: result,
			match_points: matchPoints,
			team1_id: team1Id,
			team2_id: team2Id,
		};

		onUpdate(matchData);
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

	const tournament =
		match &&
		tournaments.find(
			(tournament) =>
				Number(tournament.tournament_id) ===
				Number(match.tournamentTournamentId)
		);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/tour-destinations")
			.then((response) => {
				const tourDestinations = response.data;
				console.log(tournament);
				if (tournament) {
					const tournamentTeams = tourDestinations.filter(
						(tourDestination) =>
							Number(tourDestination.tournamentTournamentId) ===
							Number(tournament.tournament_id)
					);
					console.log(tournamentTeams);
					setTournamentTeams(tournamentTeams);
				}
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, [tournament]);

	if (!tournament) {
		return null;
	}

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit match</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "10px" }}
				>
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
						Team 1:
						<select
							value={team1Id}
							onChange={(e) => setTeam1Id(e.target.value)}
						>
							{tournamentTeams.map((tourDestination, index) => {
								const team = teams.find(
									(team) => team.team_id === tourDestination.teamTeamId
								);
								return (
									<option key={index} value={team.team_id}>
										{team.team_name}
									</option>
								);
							})}
						</select>
					</label>
					<label>
						Team 2:
						<select
							value={team2Id}
							onChange={(e) => setTeam2Id(e.target.value)}
						>
							{tournamentTeams.map((tourDestination, index) => {
								const team = teams.find(
									(team) => team.team_id === tourDestination.teamTeamId
								);
								return (
									<option key={index} value={team.team_id}>
										{team.team_name}
									</option>
								);
							})}
						</select>
					</label>
					<input type="submit" value="Update match" />
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

export default EditMatchModal;
