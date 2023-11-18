import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

function EditMatchModal({ show, onClose, onUpdate, editingMatch }) {
	const [matchDate, setMatchDate] = useState("");
	const [result, setResult] = useState(false);
	const [matchPoints, setMatchPoints] = useState(0);
	const [team1Id, setTeam1Id] = useState(0);
	const [team2Id, setTeam2Id] = useState(0);
	const [teams, setTeams] = useState([]);

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
						ID of Team 1:
						<input
							type="number"
							value={team1Id}
							onChange={(e) => setTeam1Id(e.target.value)}
						/>
					</label>
					<label>
						ID of Team 2:
						<input
							type="number"
							value={team2Id}
							onChange={(e) => setTeam2Id(e.target.value)}
						/>
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
