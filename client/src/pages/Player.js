import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import PlayerModal from "../components/PlayerModal";
import EditPlayerModal from "../components/EditPlayerModal";
import { toast } from "react-toastify";
import Select from "react-select";
import { useCallback } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

function Player() {
	const [players, setPlayers] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingPlayer, setEditingPlayer] = useState(null);
	const [teams, setTeams] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState(null);
	const [roleFilter, setRoleFilter] = useState("");
	const [filterFrom, setFilterFrom] = useState(null);
	const [filterTo, setFilterTo] = useState(null);
	const [filterFromYear, setFilterFromYear] = useState(null);
	const [filterToYear, setFilterToYear] = useState(null);
	const [selectedTeams, setSelectedTeams] = useState([]);
	const [filterSelectTeam, setFilterSelctTeam] = useState([]);

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

	const handleTeamFilterChange = (selectedOptions) => {
		console.log(selectedOptions);
		setFilterSelctTeam(selectedOptions.map((option) => option.value));
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

		if (filterSelectTeam.length > 0) {
			const filteredPlayers = filterSelectTeam.reduce((acc, el) => {
				const playersForTeam = sortableTeams.filter(
					(player) => player.teamTeamId === el
				);
				return [...acc, ...playersForTeam];
			}, []);

			sortableTeams = filteredPlayers;
		}

		if (filterFrom !== null) {
			sortableTeams = sortableTeams.filter(
				(team) => Number(team.esports_player_points) >= Number(filterFrom)
			);
		}

		if (filterTo !== null) {
			if (!filterTo) {
				return sortableTeams;
			}
			sortableTeams = sortableTeams.filter(
				(team) => Number(team.esports_player_points) <= Number(filterTo)
			);
		}

		if (filterFromYear !== null) {
			sortableTeams = sortableTeams.filter(
				(team) =>
					Number(team.date_of_birth.slice(0, 4)) >= Number(filterFromYear)
			);
		}

		if (filterToYear !== null) {
			if (!filterToYear) {
				return sortableTeams;
			}
			sortableTeams = sortableTeams.filter(
				(team) =>
					Number(team.date_of_birth.slice(0, 4)) <= Number(filterToYear)
			);
		}

		return sortableTeams;
	}, [
		filteredPlayersBySearch,
		sortConfig,
		roleFilter,
		filterFrom,
		filterTo,
		filterFromYear,
		filterToYear,
		filterSelectTeam,
	]);

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

	const calculateRoleRating = useCallback((playerData, players) => {
		const sameRolePlayers = players.filter(
			(player) => player.role === playerData.role
		);

		if (sameRolePlayers.length === 0) {
			return 1;
		}

		sameRolePlayers.sort(
			(a, b) => b.esports_player_points - a.esports_player_points
		);

		let rank = sameRolePlayers.findIndex(
			(player) => player.esports_player_id === playerData.esports_player_id
		);

		return rank + 1;
	}, []);

	const calculateGlobalRating = useCallback((playerData, players) => {
		if (players.length === 0) {
			return 1;
		}

		const sortedPlayers = [...players].sort(
			(a, b) => b.esports_player_points - a.esports_player_points
		);
		let rank = sortedPlayers.findIndex(
			(player) => player.esports_player_id === playerData.esports_player_id
		);

		return rank + 1;
	}, []);

	const updatePlayerRatings = useCallback(
		(players) => {
			// Update role ratings
			players.forEach((player) => {
				const newRoleRating = calculateRoleRating(player, players);
				if (newRoleRating !== player.role_rating) {
					player.role_rating = newRoleRating;
					axios
						.put(
							`http://localhost:5000/api/player/${player.esports_player_id}`,
							player
						)
						.catch((error) => {
							console.error(
								`Error updating player role rating: ${error}`
							);
						});
				}
			});

			players.forEach((player) => {
				const newGlobalRating = calculateGlobalRating(player, players);
				if (Number(newGlobalRating) !== Number(player.global_rating)) {
					player.global_rating = newGlobalRating;
					axios
						.put(
							`http://localhost:5000/api/player/${player.esports_player_id}`,
							player
						)
						.catch((error) => {
							console.error(
								`Error updating player global rating: ${error}`
							);
						});
				}
			});
		},
		[calculateRoleRating, calculateGlobalRating]
	);

	useEffect(() => {
		updatePlayerRatings(players);
	}, [players, updatePlayerRatings]);

	const createPlayer = (playerData) => {
		// Calculate role_rating and global_rating based on playerData
		const role_rating = calculateRoleRating(playerData, players);
		const global_rating = calculateGlobalRating(playerData, players);

		const newPlayerData = {
			...playerData,
			role_rating,
			global_rating,
		};

		const teamPlayers = players.filter(
			(player) => Number(player.teamTeamId) === Number(playerData.teamTeamId)
		);

		if (teamPlayers.length >= 5) {
			toast.error("Ви не можете додати більше пяти гравців в одну команду.");
			return;
		}

		axios
			.post("http://localhost:5000/api/player", newPlayerData)
			.then((response) => {
				const newPlayers = [...players, response.data];
				setPlayers(newPlayers);
				updatePlayerRatings(newPlayers); // Update the ratings after adding a new player
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
				const newPlayers = players.filter(
					(player) => player.esports_player_id !== id
				);
				setPlayers(newPlayers);
				updatePlayerRatings(newPlayers);
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
				const newPlayers = players.map((player) =>
					player.esports_player_id === id
						? { ...player, ...updatedPlayerData }
						: player
				);
				setPlayers(newPlayers);
				updatePlayerRatings(newPlayers);
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

	const handleFilterFrom = (event) => {
		setFilterFrom(event.target.value);
	};

	const handleFilterTo = (event) => {
		setFilterTo(event.target.value);
	};

	const handleFilterFromYear = (event) => {
		setFilterFromYear(event.target.value);
	};

	const handleFilterToYear = (event) => {
		setFilterToYear(event.target.value);
	};

	const getRandomNumberInRange = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const createRandomPlayer = (teamId) => {
		const names = [
			"John",
			"Alice",
			"Michael",
			"Sophia",
			"Sasha",
			"Denis",
			"Artem",
			"Yaroslav",
			"Viktor",
		];
		const surnames = ["Doe", "Smith", "Johnson", "Williams", "Ali", "Bush"];
		const roles = [
			"Captain",
			"Sniper",
			"Entry Fragger",
			"Refragger",
			"Support",
			"Lurker",
			"Rifler",
			"Star Player",
		];

		const randomName = names[Math.floor(Math.random() * names.length)];
		const randomSurname =
			surnames[Math.floor(Math.random() * surnames.length)];
		const randomRole = roles[Math.floor(Math.random() * roles.length)];

		const player = {
			name: randomName,
			surname: randomSurname,
			nickname: `${randomName.slice(0, 1)}${randomSurname}`, // Генерація псевдоніму
			role: randomRole,
			esports_player_points: getRandomNumberInRange(50, 200),
			date_of_birth: "2000-01-01", // Наприклад, дата народження
			teamTeamId: teamId,
		};
		const role_rating = calculateRoleRating(player, players);
		const global_rating = calculateGlobalRating(player, players);
		const newPlayerData = {
			...player,
			role_rating,
			global_rating,
		};

		return newPlayerData;
	};

	const handleTeamSelect = (selectedOptions) => {
		console.log(selectedOptions);
		setSelectedTeams(selectedOptions || []);
	};
	const handleCreatePlayers = () => {
		console.log(selectedTeams);
		const filterSelectedTeams = selectedTeams.reduce((acc, el) => {
			const filteredTeams = teams.filter(
				(team) => Number(team.team_id) === Number(el.value)
			);
			return acc.concat(filteredTeams);
		}, []);

		filterSelectedTeams.forEach((team) => {
			let findPlayers = players.filter((player) => {
				return Number(player.teamTeamId) === Number(team.team_id);
			});

			let needCountToCreate = 5 - findPlayers.length;
			if (Number(needCountToCreate) > 0 && Number(needCountToCreate) <= 5) {
				for (let i = 0; i < needCountToCreate; i++) {
					const newPlayer = createRandomPlayer(team.team_id);

					axios
						.post("http://localhost:5000/api/player", newPlayer)
						.then((response) => {
							const newPlayers = [...players, response.data];
							setPlayers(newPlayers);
							updatePlayerRatings(newPlayers);
						})
						.catch((error) => {
							console.error(`Error: ${error}`);
						});
				}
				window.location.reload();
			} else {
				toast.error(
					`У команди ${team.team_name} вже є 5 гравців, до неї не було додано ніяких гравців.`
				);
			}
		});
	};

	return (
		<div>
			<>
				<Container className="mt-5">
					<Row className="d-flex justify-content-center">
						<Col sm={4}>
							<Form className="d-flex align-items-center text-center">
								<Form.Label
									className="me-2"
									style={{ marginBottom: 0 }}
								>
									Search
								</Form.Label>
								<Form.Control
									type="search"
									placeholder="Search by nickname"
									className="me-2"
									aria-label="Search"
									value={searchTerm}
									onChange={handleSearchChange}
								/>
							</Form>
						</Col>
					</Row>
				</Container>
			</>
			<div className="d-flex flex-column mb-4">
				<div className="col-2 mb-3">
					<Form.Label>Select of roles</Form.Label>
					<Select
						isMulti
						options={roles}
						onChange={handleRoleFilterChange}
					/>
				</div>
				<div className="col-2 mb-3">
					<Form.Label>Select of teams</Form.Label>
					<Select
						isMulti
						options={teams.map((team) => ({
							value: team.team_id,
							label: team.team_name,
						}))}
						onChange={handleTeamFilterChange}
					/>
				</div>

				<Form.Label>Select filter for points</Form.Label>
				<div className="d-flex">
					<div className="col-1 me-3">
						<Form.Control
							type="text"
							placeholder="From points"
							value={filterFrom || ""}
							onChange={handleFilterFrom}
						/>
					</div>
					<div className="col-1">
						<Form.Control
							type="text"
							placeholder="To points"
							value={filterTo || ""}
							onChange={handleFilterTo}
						/>
					</div>
				</div>
			</div>
			<div className="d-flex flex-column mb-4">
				<Form.Label>Filter players by birth year</Form.Label>
				<div className="d-flex">
					<div className="col-1 me-3">
						<Form.Control
							type="text"
							placeholder="From year"
							value={filterFromYear || ""}
							onChange={handleFilterFromYear}
						/>
					</div>
					<div className="col-1">
						<Form.Control
							type="text"
							placeholder="To year"
							value={filterToYear || ""}
							onChange={handleFilterToYear}
						/>
					</div>
				</div>
			</div>
			<div style={{ marginBottom: "20px" }}>
				<p>Створити невестачаючих гравців для команди</p>
				<Select
					className="col-2"
					isMulti
					options={teams.map((team) => ({
						value: team.team_id,
						label: team.team_name,
					}))}
					onChange={handleTeamSelect}
				/>
			</div>
			<Button onClick={() => handleCreatePlayers()}>Create players</Button>
			<h1>Table of players</h1>
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
