import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";

function PlayerModal({ show, onClose, onCreate }) {
	const [playerName, setPlayerName] = useState("");
	const [playerSurname, setPlayerSurname] = useState("");
	const [playerNickname, setPlayerNickname] = useState("");
	const [playerRole, setPlayerRole] = useState("");
	const [playerGlobalRating, setPlayerGlobalRating] = useState(0);
	const [playerRoleRating, setPlayerRoleRating] = useState(0);
	const [playerPoints, setPlayerPoints] = useState(0);
	const [playerBirthDate, setPlayerBirthDate] = useState("");
	const [teamId, setTeamId] = useState(0);
	const [teams, setTeams] = useState([]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const playerData = {
			name: playerName,
			surname: playerSurname,
			nickname: playerNickname,
			role: playerRole,
			global_rating: playerGlobalRating,
			role_rating: playerRoleRating,
			esports_player_points: playerPoints,
			date_of_birth: playerBirthDate,
			teamTeamId: teamId,
		};

		if (playerPoints > 1000000000) {
			toast.error("Очки гравця не можуть бути більше за 1.000.000.000");
			return;
		}

		for (let key in playerData) {
			if (!playerData[key]) {
				toast.error(`Будь ласка, введіть ${key}`);
				return;
			}
		}

		onCreate(playerData);
	};

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/team")
			.then((res) => {
				setTeams(res.data.rows);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create Player</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form
					onSubmit={handleSubmit}
					style={{ display: "flex", flexDirection: "column", gap: "10px" }}
				>
					<label>
						Player Name:
						<input
							type="text"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
						/>
					</label>
					<label>
						Surname:
						<input
							type="text"
							value={playerSurname}
							onChange={(e) => setPlayerSurname(e.target.value)}
						/>
					</label>
					<label>
						Nickname:
						<input
							type="text"
							value={playerNickname}
							onChange={(e) => setPlayerNickname(e.target.value)}
						/>
					</label>
					<label>
						Role:
						<select
							value={playerRole}
							onChange={(e) => setPlayerRole(e.target.value)}
						>
							<option value="Captain">Captain</option>
							<option value="Sniper">Sniper</option>
							<option value="Entry Fragger">Entry Fragger</option>
							<option value="Refragger">Refragger</option>
							<option value="Support">Support</option>
							<option value="Lurker">Lurker</option>
							<option value="Rifler">Rifler</option>
							<option value="Star Player">Star Player</option>
						</select>
					</label>
					<label>
						Global Rating:
						<input
							type="number"
							value={playerGlobalRating}
							onChange={(e) => setPlayerGlobalRating(e.target.value)}
						/>
					</label>
					<label>
						Role Rating:
						<input
							type="number"
							value={playerRoleRating}
							onChange={(e) => setPlayerRoleRating(e.target.value)}
						/>
					</label>
					<label>
						Player Points:
						<input
							type="number"
							value={playerPoints}
							onChange={(e) => setPlayerPoints(e.target.value)}
						/>
					</label>
					<label>
						Date of Birth:
						<input
							type="date"
							value={playerBirthDate}
							onChange={(e) => setPlayerBirthDate(e.target.value)}
						/>
					</label>
					<label>
						Team Name:
						<select
							value={teamId}
							onChange={(e) => setTeamId(e.target.value)}
						>
							{teams.map((team) => (
								<option key={team.team_id} value={team.team_id}>
									{team.team_name}
								</option>
							))}
						</select>
					</label>

					<input type="submit" value="Create Player" />
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

export default PlayerModal;
