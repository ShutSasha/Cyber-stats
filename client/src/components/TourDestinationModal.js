import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";

function TourDestinationModal({ show, onClose, onCreate, pageTournament }) {
	const [teamTeamId, setteamTeamId] = useState("");
	const [tournamentTournamentId, settournamentTournament] = useState("");
	const [teams, setTeams] = useState([]);
	const [tournaments, setTournaments] = useState([]);

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

	// const handleSubmit = (event) => {
	// 	event.preventDefault();

	// 	const tourDestinationData = {
	// 		teamTeamId: teamTeamId,
	// 		tournamentTournamentId: tournamentTournamentId,
	// 	};

	// 	onCreate(tourDestinationData);
	// 	onClose();
	// };

	const handleSubmit = (event) => {
		event.preventDefault();

		axios
			.get(`http://localhost:5000/api/tour-destinations`)
			.then((response) => {
				const tourDestinations = response.data;
				const teamAlreadyInTournament = tourDestinations.some(
					(tourDestination) =>
						Number(tourDestination.teamTeamId) === Number(teamTeamId) &&
						Number(tourDestination.tournamentTournamentId) ===
							Number(tournamentTournamentId)
				);
				if (teamAlreadyInTournament) {
					toast.error(
						"This team is already participating in the tournament."
					);
				} else {
					const tourDestinationData = {
						teamTeamId: teamTeamId,
						tournamentTournamentId:
							pageTournament || tournamentTournamentId,
					};

					if (!teamTeamId) {
						toast.error("You need to select team");
						return;
					}

					if (!tournamentTournamentId) {
						toast.error("You need to select tournament");
						return;
					}

					onCreate(tourDestinationData);
					onClose();
				}
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create tour destination</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "10px" }}
				>
					<label>
						Name of team:
						<select
							value={teamTeamId}
							onChange={(e) => setteamTeamId(e.target.value)}
						>
							<option value="">Select a team...</option>
							{teams.map((team, index) => (
								<option key={index} value={team.team_id}>
									{team.team_name}
								</option>
							))}
						</select>
					</label>
					<label>
						Name of tournament:
						<select
							value={pageTournament || tournamentTournamentId}
							onChange={(e) => settournamentTournament(e.target.value)}
							disabled={!!pageTournament}
						>
							<option value="">Select a tournament...</option>
							{tournaments.map((tournament, index) => (
								<option key={index} value={tournament.tournament_id}>
									{tournament.tournament_name}
								</option>
							))}
						</select>
					</label>
					<input type="submit" value="Create tour destination" />
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

export default TourDestinationModal;
