import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import PlayerModal from "../components/PlayerModal";
import EditPlayerModal from "../components/EditPlayerModal";
import Button from "react-bootstrap/esm/Button";

function Player() {
	const [players, setPlayers] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingPlayer, setEditingPlayer] = useState(null);
	const [teams, setTeams] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState(null);

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const filteredPlayers = players.filter((player) =>
		player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedPlayers = React.useMemo(() => {
		let sortableTeams = [...filteredPlayers];
		if (sortConfig !== null) {
			sortableTeams.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableTeams;
	}, [filteredPlayers, sortConfig]);

	const requestSort = (key) => {
		let direction = "ascending";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "ascending"
		) {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	const createPlayer = (playerData) => {
		axios
			.post("http://localhost:5000/api/player", playerData)
			.then((response) => {
				console.log(response.data);
				setPlayers([...players, response.data]);
				closeModal();
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	const deletePlayer = (id) => {
		axios
			.delete(`http://localhost:5000/api/player/${id}`)
			.then((response) => {
				console.log(response.data);
				setPlayers(
					players.filter((player) => player.esports_player_id !== id)
				);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	const updatePlayer = (id, updatedPlayerData) => {
		axios
			.put(`http://localhost:5000/api/player/${id}`, updatedPlayerData)
			.then((response) => {
				setPlayers(
					players.map((player) =>
						player.esports_player_id === id
							? { ...player, ...updatedPlayerData }
							: player
					)
				);
				closeEditModal();
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/player")
			.then((response) => {
				setPlayers(response.data);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/team")
			.then((response) => {
				setTeams(response.data.rows);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<div>
			<input
				type="text"
				placeholder="Search by nickname"
				value={searchTerm}
				onChange={handleSearchChange}
			/>
			<h1>Players</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Name</th>
						<th>Surname</th>
						<th>Nickname</th>
						<th>Role</th>
						<th onClick={() => requestSort("global_rating")}>
							Global Rating
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "global_rating" &&
										sortConfig.direction === "ascending"
											? 1
											: 0.3,
								}}
							>
								🔼
							</span>
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "global_rating" &&
										sortConfig.direction === "descending"
											? 1
											: 0.3,
								}}
							>
								🔽
							</span>
						</th>
						<th onClick={() => requestSort("role_rating")}>
							Role Rating
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "role_rating" &&
										sortConfig.direction === "ascending"
											? 1
											: 0.3,
								}}
							>
								🔼
							</span>
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "role_rating" &&
										sortConfig.direction === "descending"
											? 1
											: 0.3,
								}}
							>
								🔽
							</span>
						</th>
						<th onClick={() => requestSort("esports_player_points")}>
							Player Points
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "esports_player_points" &&
										sortConfig.direction === "ascending"
											? 1
											: 0.3,
								}}
							>
								🔼
							</span>
							<span
								style={{
									opacity:
										sortConfig &&
										sortConfig.key === "esports_player_points" &&
										sortConfig.direction === "descending"
											? 1
											: 0.3,
								}}
							>
								🔽
							</span>
						</th>
						<th>Date of birth</th>
						<th>Team name</th>
					</tr>
				</thead>
				<tbody>
					{sortedPlayers.map((player) => {
						const team = teams.find(
							(team) => team.team_id === player.teamTeamId
						);
						return (
							<tr key={player.esports_player_id}>
								<td>{player.name}</td>
								<td>{player.surname}</td>
								<td>{player.nickname}</td>
								<td>{player.role}</td>
								<td>{player.global_rating}</td>
								<td>{player.role_rating}</td>
								<td>{player.esports_player_points}</td>
								<td>{player.date_of_birth}</td>
								<td>{team ? team.team_name : "Команда не знайдена"}</td>
								<td>
									<div
										style={{
											display: "flex",
											justifyContent: "space-around",
											alignItems: "center",
										}}
									>
										<Button
											variant="danger"
											onClick={() =>
												deletePlayer(player.esports_player_id)
											}
										>
											Delete
										</Button>
										<Button
											variant="primary"
											onClick={() => {
												setEditingPlayer(player);
												openEditModal();
											}}
										>
											Edit
										</Button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
			<Button onClick={openModal}>Create Player</Button>

			<PlayerModal
				show={showModal}
				onClose={closeModal}
				onCreate={createPlayer}
			/>

			<EditPlayerModal
				show={showEditModal}
				onClose={closeEditModal}
				onUpdate={(updatedPlayerData) =>
					updatePlayer(editingPlayer.esports_player_id, updatedPlayerData)
				}
				editingPlayer={editingPlayer}
			/>
		</div>
	);
}

export default Player;
