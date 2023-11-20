import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import PlayerModal from "../components/PlayerModal";
import EditPlayerModal from "../components/EditPlayerModal";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-toastify";
import Select from "react-select";

function Player() {
	const [players, setPlayers] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingPlayer, setEditingPlayer] = useState(null);
	const [teams, setTeams] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState(null);
	const [roleFilter, setRoleFilter] = useState("");

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const roles = [
		{ value: "Captain", label: "Captain" },
		{ value: "Sniper", label: "Sniper" },
		{ value: "Entry Fragger", label: "Entry Fragger" },
		{ value: "Refragger", label: "Refragger" },
		{ value: "Support", label: "Support" },
		{ value: "Lurker", label: "Lurker" },
		{ value: "Rifler", label: "Rifler" },
		{ value: "Star Player", label: "Star Player" },
	];

	const handleRoleFilterChange = (selectedOptions) => {
		setRoleFilter(selectedOptions.map((option) => option.value));
	};

	const filteredPlayersBySearch = players.filter((player) =>
		player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedPlayers = React.useMemo(() => {
		let sortableTeams = [...filteredPlayersBySearch];

		if (roleFilter.length > 0) {
			sortableTeams = sortableTeams.filter((player) =>
				roleFilter.includes(player.role)
			);
		}

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
	}, [filteredPlayersBySearch, sortConfig, roleFilter]);

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
		const teamPlayers = players.filter(
			(player) => Number(player.teamTeamId) === Number(playerData.teamTeamId)
		);

		if (teamPlayers.length >= 5) {
			toast.error("Ви не можете додати більше пяти гравців в одну команду.");
			return;
		}

		axios
			.post("http://localhost:5000/api/player", playerData)
			.then((response) => {
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
				setPlayers(
					players.filter((player) => player.esports_player_id !== id)
				);
			})
			.catch((error) => {
				console.error(`Error: ${error}`);
			});
	};

	const updatePlayer = (id, updatedPlayerData) => {
		const teamPlayers = players.filter(
			(player) =>
				Number(player.teamTeamId) === Number(updatedPlayerData.teamTeamId)
		);
		if (
			teamPlayers.length >= 5 &&
			!teamPlayers.some((player) => player.esports_player_id === id)
		) {
			toast.error(
				"Ви не можете зробити більше пяти гравців в одну команду."
			);
			return;
		}

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
			<Select isMulti options={roles} onChange={handleRoleFilterChange} />
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
