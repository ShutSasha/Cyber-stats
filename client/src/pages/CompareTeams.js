import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { toast } from "react-toastify";
import Alert from "react-bootstrap/Alert";
import CreatePlayersModal from "../components/CreatePlayersModal";

function CompareTeams() {
	const [selectedTeam1, setSelectedTeam1] = useState("");
	const [selectedTeam2, setSelectedTeam2] = useState("");
	const [winPercentage, setWinPercentage] = useState([]);
	const [selectedTeams, setSelectedTeams] = useState([]);
	const [teams, setTeams] = useState([]);
	const [players, setPlayers] = useState([]);
	const [isClear, setIsClear] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [numberTeam, setNumberTeam] = useState("");

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

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
			nickname: `${randomName.slice(0, 1)}${randomSurname}`,
			role: randomRole,
			esports_player_points: getRandomNumberInRange(50, 200),
			date_of_birth: "2000-01-01",
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

	useEffect(() => {
		updatePlayerRatings(players);
	}, [players, updatePlayerRatings]);

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

	const handleClear = () => {
		setIsClear(true);
	};

	const teamOptions = teams.map((team) => ({
		value: team.team_id,
		label: team.team_name,
	}));

	const calculateWinPercentage = () => {
		if (!selectedTeam1 || !selectedTeam2) {
			toast.error("Оберіть дві команди");
			return;
		}
		const playersTeam1 = players.filter(
			(player) => Number(player.teamTeamId) === Number(selectedTeam1)
		);
		const playersTeam2 = players.filter(
			(player) => Number(player.teamTeamId) === Number(selectedTeam2)
		);
		if (
			Number(playersTeam1.length) !== 5 ||
			Number(playersTeam2.length) !== 5
		) {
			let errorMessage = "";

			if (playersTeam1.length !== 5) {
				openModal();
				let arr = [{ value: selectedTeam1 }];
				setSelectedTeams(arr);
				setNumberTeam(1);
				errorMessage += `У команді 1 не вистачає гравців. `;
			}

			if (playersTeam2.length !== 5) {
				errorMessage += `У команді 2 не вистачає гравців. `;
				let arr = [{ value: selectedTeam2 }];
				openModal();
				console.log(showModal);
				setSelectedTeams(arr);
				setSelectedTeams([{ value: selectedTeam2 }]);
				console.log(selectedTeams);
				errorMessage += `У команді 2 не вистачає гравців. `;
			}
			toast.error(
				`Для порівняння команд необхідно по 5 гравців у кожній команді. ${errorMessage}`
			);

			return;
		}

		if (Number(selectedTeam1) === Number(selectedTeam2)) {
			toast.error(`Одну й ту саму команду не можна порівнювати`);
			return;
		}
		const totalPointsTeam1 = playersTeam1.reduce(
			(total, player) => total + player.esports_player_points,
			0
		);
		const totalPointsTeam2 = playersTeam2.reduce(
			(total, player) => total + player.esports_player_points,
			0
		);

		const winPercentageTeam1 =
			(totalPointsTeam1 / (totalPointsTeam1 + totalPointsTeam2)) * 100;
		const winPercentageTeam2 =
			(totalPointsTeam2 / (totalPointsTeam1 + totalPointsTeam2)) * 100;

		setIsClear(false);

		setWinPercentage([
			winPercentageTeam1.toFixed(2),
			winPercentageTeam2.toFixed(2),
		]);
	};

	useEffect(() => {}, [winPercentage]);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/player")
			.then((res) => setPlayers(res.data))
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/team")
			.then((res) => {
				setTeams(res.data.rows);
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<div>
			{winPercentage.length === 2 && !isClear && (
				<>
					<Alert
						variant={
							winPercentage[0] > winPercentage[1] ? "success" : "danger"
						}
					>
						Win Percentage for Team1: {winPercentage[0]}%
					</Alert>
					<Alert
						variant={
							winPercentage[1] > winPercentage[0] ? "success" : "danger"
						}
					>
						Win Percentage for Team2: {winPercentage[1]}%
					</Alert>
				</>
			)}
			<h1>Compare Teams</h1>
			<h5>Choose teams for compare below</h5>
			<label>
				Team 1:
				<Select
					styles={{
						control: (base) => ({
							...base,
							minWidth: "200px",
							marginRight: "50px",
						}),
					}}
					value={teamOptions.find(
						(option) => option.value === selectedTeam1
					)}
					onChange={(option) =>
						setSelectedTeam1(option ? option.value : "")
					}
					options={teamOptions}
					isClearable
				/>
			</label>
			<label>
				Team 2:
				<Select
					styles={{ control: (base) => ({ ...base, minWidth: "200px" }) }}
					value={teamOptions.find(
						(option) => option.value === selectedTeam2
					)}
					onChange={(option) =>
						setSelectedTeam2(option ? option.value : "")
					}
					options={teamOptions}
					isClearable
				/>
			</label>
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: "50px",
					marginBottom: "50px",
				}}
			>
				<Table
					striped
					bordered
					hover
					style={{ marginRight: "100px", tableLayout: "fixed" }}
				>
					<tbody>
						{teams
							.filter(
								(team) => Number(team.team_id) === Number(selectedTeam1)
							)
							.map((team) => (
								<React.Fragment key={team.team_id}>
									<tr>
										<th>Image</th>
										<td>
											{team.img && (
												<img
													src={`http://localhost:5000/${team.img}`}
													alt={team.team_name}
													style={{ width: "70px", height: "70px" }}
												/>
											)}
										</td>
									</tr>
									<tr>
										<th>Team Name</th>
										<td>{team.team_name}</td>
									</tr>
									<tr>
										<th>Country</th>
										<td>{team.team_country}</td>
									</tr>
									<tr>
										<th>Date of Creation</th>
										<td>{team.date_of_creating_team}</td>
									</tr>
									<tr>
										<th>Coach</th>
										<td>{team.coach_team}</td>
									</tr>
									<tr>
										<th>Global Rating</th>
										<td>{team.global_rating}</td>
									</tr>
									<tr>
										<th>Points</th>
										<td>{team.team_points}</td>
									</tr>
								</React.Fragment>
							))}
					</tbody>
				</Table>
				<Table striped bordered hover style={{ tableLayout: "fixed" }}>
					<tbody>
						{teams
							.filter(
								(team) => Number(team.team_id) === Number(selectedTeam2)
							)
							.map((team) => (
								<React.Fragment key={team.team_id}>
									<tr>
										<th>Image</th>
										<td>
											{team.img && (
												<img
													src={`http://localhost:5000/${team.img}`}
													alt={team.team_name}
													style={{ width: "70px", height: "70px" }}
												/>
											)}
										</td>
									</tr>
									<tr>
										<th>Team Name</th>
										<td>{team.team_name}</td>
									</tr>
									<tr>
										<th>Country</th>
										<td>{team.team_country}</td>
									</tr>
									<tr>
										<th>Date of Creation</th>
										<td>{team.date_of_creating_team}</td>
									</tr>
									<tr>
										<th>Coach</th>
										<td>{team.coach_team}</td>
									</tr>
									<tr>
										<th>Global Rating</th>
										<td>{team.global_rating}</td>
									</tr>
									<tr>
										<th>Points</th>
										<td>{team.team_points}</td>
									</tr>
								</React.Fragment>
							))}
					</tbody>
				</Table>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: "50px",
					marginBottom: "50px",
				}}
			>
				<Table
					striped
					bordered
					hover
					style={{ marginRight: "100px", tableLayout: "fixed" }}
				>
					<thead>
						<tr>
							<th>Player name</th>
							<th>Player surname</th>
							<th>Player nickname</th>
							<th>Global rating</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						{players
							.filter(
								(player) =>
									Number(player.teamTeamId) === Number(selectedTeam1)
							)
							.map((player) => (
								<tr key={player.esports_player_id}>
									<td>{player.name}</td>
									<th>{player.surname}</th>
									<th>{player.nickname}</th>
									<th>{player.global_rating}</th>
									<th>{player.esports_player_points}</th>
								</tr>
							))}
					</tbody>
				</Table>
				<Table striped bordered hover style={{ tableLayout: "fixed" }}>
					<thead>
						<tr>
							<th>Player name</th>
							<th>Player surname</th>
							<th>Player nickname</th>
							<th>Global rating</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						{players
							.filter(
								(player) =>
									Number(player.teamTeamId) === Number(selectedTeam2)
							)
							.map((player) => (
								<tr key={player.esports_player_id}>
									<td>{player.name}</td>
									<th>{player.surname}</th>
									<th>{player.nickname}</th>
									<th>{player.global_rating}</th>
									<th>{player.esports_player_points}</th>
								</tr>
							))}
					</tbody>
				</Table>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: "20px",
				}}
			>
				<div>
					<Button
						style={{ marginRight: "20px" }}
						variant="outline-primary"
						onClick={calculateWinPercentage}
						className="btn-lg btn-block"
					>
						Compare
					</Button>
					<Button
						variant="outline-danger"
						onClick={handleClear}
						className="btn-lg btn-block"
					>
						Clear
					</Button>
				</div>
				<CreatePlayersModal
					show={showModal}
					onClose={closeModal}
					onCreate={handleCreatePlayers}
					numberTeam={numberTeam}
				/>
				<CreatePlayersModal
					show={showModal}
					onClose={closeModal}
					onCreate={handleCreatePlayers}
					numberTeam={numberTeam}
				/>
			</div>
		</div>
	);
}

export default CompareTeams;
